import { Injectable, group, NgZone } from '@angular/core';
import { log } from 'util';
import { lastSavedService } from './index'
import {
  Http,
  Response
} from '@angular/http';
import {
  Schema
} from '../models/schema';
import {
  Observable
} from 'rxjs/Observable';
import {
  of
} from 'rxjs/observable/of';
import {
  File
} from '../models/index'

import "rxjs/add/observable/of";
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  readdir,
  stat,
  writeFile
} from 'fs';
import {
  resolve
} from 'path';

import { LastOpened } from './lastOpened.service';
import { ToastService } from '../providers/toast.service';
import { CheckOsService } from './checkOS.service';

@Injectable()
export class GlobalDataService {
  public current_project: any; //this is the project data object
  public current_project_name: any;
  private pouch: any;
  public teilnehmer: Array<any>;
  private temp: Array<any>;
  private filePath: any;
  private requiredProperties: Array<any>;
  private _error: any;
  private passKey: any;
  private cryptoConfig: any;
  private CryptoJS = require("crypto-js");
  private lastOpendFilePath: string = "assets/data/lastOpened.json";
  private loadedFiles = [];

  constructor(
    private http: Http,
    public lastOpened: LastOpened,
    public toastService: ToastService,
    public osService: CheckOsService,
    public saveService: lastSavedService,
    public zone: NgZone) {
    this.passKey = '394rwe78fudhwqpwriufdhr8ehyqr9pe8fud';
  }

  /**
   * Getter methods to load local projects
   * and to dispatch data to each component
   */

  public getLocalFile(file_path): Observable<Schema> {
    this.current_project = null;
    return this.http.get(file_path)
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.requiredProperties = ['title', 'teilnehmer', 'bewertungsschema', 'bewertung', 'gruppen']
        var encryptedJSON = res.text();
        var bytes = this.CryptoJS.AES.decrypt(encryptedJSON, this.passKey);
        var string = bytes.toString(this.CryptoJS.enc.Utf8);        
        this.current_project = JSON.parse(string);
        this._error = 0;
        for (let property in this.requiredProperties) {
          if (this.current_project.hasOwnProperty(this.requiredProperties[property])) {
            continue;
          }
          else {
            this._error = 1
          }
        }
        this.current_project_name = file_path;
        this.current_project_name = this.current_project.title;
        this.filePath = file_path;
        this.checkLastOpendFiles();
        this.saveJson();
      })
      .catch((error: any) => Observable.throw(error || 'Reading error'));
  }

  public checkJsonValidity(): any {
    if (this._error == 1) {
      this.current_project = null;
      this.current_project_name = null;
      this.filePath = null;
    }
    return this._error;
  }
  public getCurrentProject(): Observable<Schema> {
    this.checkCurrentValidity();
    return of(this.current_project);
  }

  public getCurrentProjectName(): Observable<String> {
    return of(this.current_project_name);
  }

  public getParticipants(): Observable<Array<any>> {
    return of(this.current_project.teilnehmer);
  }

  public getFilePath() {
    return this.filePath;
  }
  public getGradingSteps(): any {
    var gradingSteps = [];

    try {
      this.current_project.bewertungsschema.allgemeine_infos.notenschluessel.forEach(step => {
        gradingSteps.push(step.note);
      });
      return gradingSteps;
    }
    catch (err) {
      console.log("fail in getGradingSteps")
    }
  }

  public getGradesPerStep(nSteps): Array<any> {
    var gradesPerStep = new Array(nSteps).fill(0);
    var gradingSteps = this.getGradingSteps();

    this.current_project.teilnehmer.forEach(student => {
      for (var i = 0; i < nSteps; i++) {
        if (student.grade == gradingSteps[i]) {
          gradesPerStep[i] = gradesPerStep[i] + 1;
        }
      }
    });
    return gradesPerStep;
  }

  public getStudentGrading(): Observable<any> {
    let gradings = this.current_project.bewertung;
    let task_counter = parseFloat(this.current_project.bewertungsschema.aufgaben.length);

    this.current_project.teilnehmer.forEach(student => {
      student.grade = 0;
      student.finish = 0.0;
    });

    gradings.forEach(grading => {
      this.current_project.teilnehmer.forEach(student => {
        if (student.id == grading.student_id) {
          student.grade = this.getCurrentStudentGrade(grading);
          student.finish = (this.getCorrectionProgress(grading) / task_counter).toFixed(2);
        }
      });
    });

    return of(this.current_project.teilnehmer);
  }

  private getCorrectionProgress(student): number {
    let corrected = 0;
    student.einzelwertungen.forEach(grade => {
      if (grade.erreichte_punkte !== null) {
        corrected++;
      }
    });

    return corrected;
  }

  private getCurrentStudentGrade(student): number {
    let sum_grades = 0;

    student.einzelwertungen.forEach(grade => {
      sum_grades = sum_grades + grade.erreichte_punkte;
    });

    return this.getGradeByScale(sum_grades);
  }

  private getGradeByScale(sum_grade): number {
    let grading_schema = this.current_project.bewertungsschema.allgemeine_infos.notenschluessel;
    let returnValue = 0;
    let grade_found = false;

    grading_schema.some(element => {
      if (element.wert_min <= sum_grade) {
        if (!grade_found) {
          grade_found = true;
          returnValue = element.note;
        }
      }
    });
    return returnValue;
  }

  public getStudentsWithGroup(): Observable<Array<any>> {
    let students = this.current_project.teilnehmer;
    let groups = this.current_project.gruppen;
    students.forEach(student => {
      student.group = "";
    });

    groups.forEach(group => {
      group.studenten.forEach(student_id => {
        students.forEach(student => {
          if (student.id == student_id) {
            student.group = group.name;
          }
        });
      });
    });
    return of(students);
  }

  public getStudentsByGroup(groupname): any {
    let groupmembers = [];
    let students = this.current_project.teilnehmer;

    students.forEach(student => {
      if (student.group == groupname) {
        groupmembers.push(student);
      }
    });

    return (groupmembers);
  }

  /**
  * Validations methods
  */

  private checkCurrentValidity(): void {
    this.checkStudentsInGrading(); //checks if all students are in grading object if not adds them
    this.checkTasksInGrading(); //checks if all tasks are in student grading object if not adds them
  }

  private checkStudentsInGrading(): void {
    let grading = [];

    this.current_project.teilnehmer.forEach(student => {
      let student_found = false;

      this.current_project.bewertung.forEach(student_bewertung => {
        if (student.id == student_bewertung.student_id) {
          grading.push(student_bewertung);
          student_found = true;
        }
      });
      if (!student_found) {
        grading.push(this.createSingleStudentGrading(student.id));
      }
    });
    this.current_project.bewertung = grading;
  }

  private checkTasksInGrading(): void {
    let grading = [];

    try {
      this.current_project.bewertung.forEach(student => {
        let single_grading = [];

        this.current_project.bewertungsschema.aufgaben.forEach(aufgabe => {
          let task_found = false;

          student.einzelwertungen.forEach(einzelwertung => {
            if (einzelwertung.aufgaben_id == aufgabe.id) {
              task_found = true;
              single_grading.push(einzelwertung);
            }
          });
          if (!task_found) {
            single_grading.push(this.createTaskCorrection(aufgabe.id));
          }
        });

        grading.push({
          "student_id": student.student_id,
          "einzelwertungen": single_grading
        });
      });
      this.current_project.bewertung = grading;
    } catch (err) {
      console.log("could not get available tasks")
    }
  }

  public createGroups(): void {
    this.current_project.gruppen = [];
  }

  public createNewStudent(): Observable<any> {
    let user_id = 0;

    try {
      user_id = this.current_project.teilnehmer[this.current_project.teilnehmer.length - 1].id + 1;
    }
    finally {
      let user = {
        "id": user_id,
        "mtknr": 1234,
        "name": "",
        "vorname": "",
        "studiengang": "",
        "fachsemester": 0,
        "mail": "",
        "status": ""
      };
      return of(user);
    }
  }

  private createNewStudentGrading(): any {
    let gradings = [];

    this.current_project.teilnehmer.forEach(student => {
      gradings.push(this.createSingleStudentGrading(student.id))
    });

    this.setNewGrading(gradings);
  }

  private createSingleStudentGrading(student_id): any {
    return {
      'student_id': student_id,
      'einzelwertungen': this.createCurrentCorrection()
    };
  }

  private createCurrentCorrection(): any {
    try {
      let corrections = [];
      if (Object.keys(this.current_project.bewertungsschema).length == 0) {
        this.current_project.bewertungsschema.aufgaben.forEach(task => {
          corrections.push(this.createTaskCorrection(task.id));
        });
        return corrections;
      }
      else {
        return [];
      }
    }
    catch (err) {
      console.log("could not create current corrections")
    }
  }

  private createTaskCorrection(task_id): any {
    return {
      'aufgaben_id': task_id,
      'erreichte_punkte': null,
      'comment_privat': '',
      'comment_public': ''
    }
  }

  public createSchema(): Observable<any> {
    this.current_project.bewertungsschema = {
      "allgemeine_infos": {
        "notenschluessel": [
          {
            "note": 5.0,
            "wert_min": 0
          }
        ],
        "bewertungseinheit": "Punkte"
      },
      "aufgaben": [
      ]
    };

    return of(this.current_project);
  }

  private saveJson(): void {
    var encryptedJSON = this.CryptoJS.AES.encrypt(JSON.stringify(this.current_project), this.passKey);
    writeFile(this.filePath, encryptedJSON, (err) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message);
      }
      else {
          this.saveService.save()
        // alert("The file has been succesfully saved");
        // console.log("The file has been saved")
      }
    });
  }

  public saveNewFile(path, json): any {    
    var encryptedJSON = this.CryptoJS.AES.encrypt(JSON.stringify(json), this.passKey);
    writeFile(path, encryptedJSON, (err) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message);
        return -1
      }
      else {
         this.saveService.save()
        // alert("The file has been succesfully saved");
        return 1;
        // console.log("The file has been saved")
      }
    });
  }

  public checkLastOpendFiles(): void{    
    this.lastOpened.updateLastOpendFiles(this.filePath).subscribe(
      lastOpenedFiles => { 
        this.loadedFiles = lastOpenedFiles[0];
        if(!lastOpenedFiles[1]){
          this.createNewLastOpenedFile(this.filePath);
        }
        else{
        }
        this.saveLoadedFile();       
      }
    );
  }

  /**
   * Setter methods to update global project
   */

  public setNewStudents(students): void {
    this.current_project.teilnehmer.push(students);
    this.saveJson();
  }

  public setNewStudentsComplete(students): void { 
    this.current_project.teilnehmer = students; 
    this.checkCurrentValidity(); 
    this.saveJson(); 
  }

  public setNewGrading(schema): void {
    this.current_project.bewertungsschema = schema;
    this.saveJson();
  }

  public setNewGroups(grouped_students): void {
    let groups = this.current_project.gruppen;
    groups.forEach(group => {
      group.studenten = [];
      grouped_students.forEach(student => {
        if (student.group == group.name) {
          group.studenten.push(student.id);
        }
      });
    });
    this.current_project.gruppen = groups;
    this.saveJson();
  }

  public setNewGroupsComplete(groups): void {
    this.current_project.gruppen = groups;
    this.saveJson();
  }

  public getGroupIdByName(name): number {
    let groups = this.current_project.gruppen;
    let id = -1;
    let position = -1;
    groups.forEach(group => {
      position++;
      if (group.name == name) {
        id = position;
      }
    });
    return id;
  }

  public setNewCorrection(correction): void {
    this.current_project.bewertung = correction;
    this.saveJson();
  }

  public processImport(file): Observable<any> {
    this.current_project;
    return this.http.get(file).map((res: Response) => {
      this.current_project.bewertungsschema = res.json().bewertungsschema;
      return this.current_project;
    })
  }

  private createNewLastOpenedFile(file_path: String){
    let newFile = {
              "last_opened": new Date(),
              "title": this.current_project_name,
              "path": file_path
    }
    this.loadedFiles.push(newFile);
}

  public saveLoadedFile(): void{
    let slash = this.osService.getSlashFormat();    
    let the_arr = __dirname.split(slash);
    the_arr.pop();
    let path = the_arr.join(slash) + slash + "src" + slash;
    
    writeFile(path + this.lastOpendFilePath, JSON.stringify(this.loadedFiles), (err) => {
        if (err) {
          alert("An error ocurred creating the file " + err.message);
        }
        else {
          // alert("The file has been succesfully saved");
          // console.log("The file has been saved")
        }
      });
  }

}
