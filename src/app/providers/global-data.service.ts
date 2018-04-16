import { Injectable, group, NgZone } from '@angular/core';
import { log } from 'util';
import { Http, Response } from '@angular/http';

import "rxjs/add/observable/of";
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Schema } from '../models/schema';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { File } from '../models/index'
import { readdir, stat, writeFile } from 'fs';
import { resolve } from 'path';

import { LastOpened } from './lastOpened.service';
import { ToastService } from '../providers/toast.service';
import { CheckOsService } from './checkOS.service';
import { lastSavedService } from './index';


@Injectable()
export class GlobalDataService {

  public current_project: any;
  public current_project_name: any;

  private requiredProperties: Array <any> = ['title', 'teilnehmer', 'bewertungsschema', 'bewertung', 'gruppen'] ;
  private _error: any;

  private passKey: any;
  private cryptoConfig: any;
  private CryptoJS = require("crypto-js");

  private lastOpendFilePath: string = "assets/data/lastOpened.json";
  private loadedFiles: Array<any> = [];
  private filePath: any;

  public teilnehmer: Array <any > ;
  private temp: Array <any> ;

  constructor(
    private http: Http,
    public lastOpened: LastOpened,
    public toastService: ToastService,
    public osService: CheckOsService,
    public saveService: lastSavedService,
    public zone: NgZone) {
    this.passKey = '394rwe78fudhwqpwriufdhr8ehyqr9pe8fud';
  }

  /** ---------------------------------------------------------------------
   * GET methods
   * Main task is to load local projects and to dispatch data to each component.
   * Furthermore these methods provide special grade calculation for different components.
   * --------------------------------------------------------------------- */

  public getLocalFile(file_path): Observable < Schema > {
    this.current_project = null;
    return this.http.get(file_path)
      .map((res: Response) => {
        var encryptedJSON = res.text();
        var bytes = this.CryptoJS.AES.decrypt(encryptedJSON, this.passKey);
        var string = bytes.toString(this.CryptoJS.enc.Utf8);
        this.current_project = JSON.parse(string);
        this._error = 0;
        for (let property in this.requiredProperties) {
          if (this.current_project.hasOwnProperty(this.requiredProperties[property])) {
            continue;
          } else {
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

  public getCurrentProject(): Observable < Schema > {
    this.checkCurrentValidity();
    return of(this.current_project);
  }

  public getCurrentProjectName(): Observable < String > {
    return of(this.current_project_name);
  }

  public getParticipants(): Observable < Array < any >> {
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
    } catch (err) {
      this.toastService.setError("Fail in getGradingSteps()");
    }
  }

  public getGradesPerStep(nSteps): Array < any > {
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

  public getTaskSteps(): any {
    let tasks = [];

    this.current_project.bewertungsschema.aufgaben.forEach(task => {
      tasks.push(task.name);
    });

    return tasks;
  }

  public getTaskDataset(single_student, student_id ? ): any {
    if (single_student) {
      return [this.getLabelMaxPoints(), this.getLabelStudentPoints(student_id)];
    } else {
      return [this.getLabelMaxPoints(), this.getLabelAveragePoints()];
    }
  }

  private getLabelMaxPoints(): any {
    let labelMaxPointsData = [];

    this.current_project.bewertungsschema.aufgaben.forEach(task => {
      labelMaxPointsData.push(task.max_punkt);
    });

    let labelMaxPoints = {
      "label": "Max. erreichbare Punkte",
      "backgroundColor": "#c2185b",
      "data": labelMaxPointsData
    };

    return labelMaxPoints;
  }

  private getLabelAveragePoints(): any {
    let labelAveragePointsData = [];

    this.current_project.bewertungsschema.aufgaben.forEach(task => {
      let task_id = task.id;
      let taskPointsAverage = (this.getTaskPoints(task_id) / this.current_project.teilnehmer.length).toFixed(2);
      labelAveragePointsData.push(taskPointsAverage);
    });

    let labelAveragePoints = {
      "label": "Erreichte Punkte",
      "backgroundColor": "#900150",
      "data": labelAveragePointsData
    };

    return labelAveragePoints;
  }

  private getLabelStudentPoints(student_id): any {
    let labelStudentPointsData = [];

    this.current_project.bewertung.forEach(student => {
      if (student.student_id == student_id) {
        student.einzelwertungen.forEach(element => {
          let points = element.erreichte_punkte;
          if (points == null) {
            points = 0;
          }
          labelStudentPointsData.push(points);
        });
      }
    });

    let labelAveragePoints = {
      "label": "Erreichte Punkte",
      "backgroundColor": "#900150",
      "data": labelStudentPointsData
    };
    return labelAveragePoints;
  }

  public getTaskPoints(task_id): any {
    let taskPoints = 0;

    this.current_project.bewertung.forEach(student => {
      student.einzelwertungen.forEach(student_task => {
        if (student_task.aufgaben_id == task_id) {
          taskPoints = taskPoints + student_task.erreichte_punkte;
        }
      });
    });

    return taskPoints;
  }

  public getStudentGrading(): Observable < any > {
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

  public getStudentsWithGroup(): Observable < Array < any >> {
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

  public getStudentTotalPoints(student_id): any {
    let total_points = 0;

    this.current_project.bewertung.forEach(element => {
      if (element.student_id == student_id) {
        element.einzelwertungen.forEach(task => {
          total_points = total_points + task.erreichte_punkte;
        });
      }
    });

    return total_points;
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

  /** ---------------------------------------------------------------------
  * SET methods to update global project
  * Operations like adding new groups, students and gradings
  * are outsourced into those methods.
  * --------------------------------------------------------------------- */

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

  public setNewCorrection(correction): void {
    this.current_project.bewertung = correction;
    this.saveJson();
  }

  public processImport(file): Observable < any > {
    this.current_project;
    return this.http.get(file).map((res: Response) => {
      this.current_project.bewertungsschema = res.json().bewertungsschema;
      return this.current_project;
    })
  }

  /** ---------------------------------------------------------------------
  * VALIDATE methods
  * Main task is to update indirect relationships in global data object,
  * such as single student gradings.
  * --------------------------------------------------------------------- */
  private checkCurrentValidity(): void {
    this.checkStudentsInGrading();
    this.checkTasksInGrading();
  }

  /** Checks if all students are in grading object. If not, adds them. */
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

  /** Checks if all tasks are in student grading object. If not, adds them. */
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
      this.toastService.setError("Konnte keine verfügbaren Aufgaben erhalten.");
    }
  }

  public checkLastOpendFiles(): void {
    this.lastOpened.updateLastOpendFiles(this.filePath).subscribe(
      lastOpenedFiles => {
        this.loadedFiles = lastOpenedFiles[0];
        if (!lastOpenedFiles[1]) {
          this.createNewLastOpenedFile(this.filePath);
        } else {}
        this.saveLoadedFile();
      }
    );
  }

  public checkMtknr(mtknr): boolean {
    let check = true;
    this.current_project.teilnehmer.forEach((existing_student) => {
      if (existing_student.mtknr == mtknr) {
        check = false
      }
    });
    return check;
  }

  public createGroups(): void {
    this.current_project.gruppen = [];
  }

  public createNewStudent(): Observable < any > {
    let user_id = 0;

    try {
      user_id = this.current_project.teilnehmer[this.current_project.teilnehmer.length - 1].id + 1;
    } finally {
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
      } else {
        return [];
      }
    } catch (err) {
      this.toastService.setError("Konnte keine aktuellen Korrekturen erstellen.");
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

  public createSchema(): Observable < any > {
    this.current_project.bewertungsschema = {
      "allgemeine_infos": {
        "notenschluessel": [{
          "note": 5.0,
          "wert_min": 0
        }],
        "bewertungseinheit": "Punkte"
      },
      "aufgaben": []
    };

    return of(this.current_project);
  }


  private createNewLastOpenedFile(file_path: String) {
    let newFile = {
      "last_opened": new Date(),
      "title": this.current_project_name,
      "path": file_path
    }
    this.loadedFiles.push(newFile);
  }

  /** ---------------------------------------------------------------------
  * FILE interaction methods
  * Main task is to store and encrypt any data permanently to the hard drive.
  * --------------------------------------------------------------------- */
  private saveJson(): void {
    var encryptedJSON = this.CryptoJS.AES.encrypt(JSON.stringify(this.current_project), this.passKey);
    writeFile(this.filePath, encryptedJSON, (err) => {
      if (err) {
        this.toastService.setError("Beim Erstellen der Datei ist ein Fehler aufgetreten " + err.message);
      } else {
        this.saveService.save();
      }
    });
  }

  public saveNewFile(path, json): any {
    var encryptedJSON = this.CryptoJS.AES.encrypt(JSON.stringify(json), this.passKey);
    writeFile(path, encryptedJSON, (err) => {
      if (err) {
        this.toastService.setError("Beim Erstellen der Datei ist ein Fehler aufgetreten " + err.message);
        return -1
      } else {
        this.saveService.save()
        return 1;
      }
    });
  }

  public saveLoadedFile(): void {
    let slash = this.osService.getSlashFormat();
    let the_arr = __dirname.split(slash);
    the_arr.pop();
    let path = the_arr.join(slash) + slash + "src" + slash;

    writeFile(path + this.lastOpendFilePath, JSON.stringify(this.loadedFiles), (err) => {
      if (err) {
        this.toastService.setError("Beim Erstellen der Datei ist ein Fehler aufgetreten " + err.message);
      } else {}
    });
  }

}
