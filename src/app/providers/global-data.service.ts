import { Injectable, group } from '@angular/core';
import { log } from 'util';

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

@Injectable()
export class GlobalDataService {
  public current_project: any; //this is the project data object
  public current_project_name: any;
  private pouch: any;
  public teilnehmer: Array<any>;
  private temp: Array<any>;
  private filePath: any;

  constructor(
    private http: Http) { }

  /**
   * Getter methods to load local projects
   * and to dispatch data to each component
   */

  public getLocalFile(file_path): Observable<Schema> {
    return this.http.get(file_path)
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.current_project = res.json();
        this.current_project_name = file_path;
        this.current_project_name = this.current_project.title;
        this.filePath = file_path;
        // console.log(file_path.split('\\').pop().split('/').pop());
      })
      //...errors if any
      .catch((error: any) => Observable.throw(error.json().error || 'Reading error'));
  }

  public getCurrentProject(): Observable<Schema> {
    this.checkCurrentValidity();
    return of(this.current_project);
  }

  public getCurrentProjectName(): Observable<String> {
    return of(this.current_project_name);
  }

  public getParticipants(): Observable<Array<any>> {
    return of(this.current_project.teilnehmer)
  }

  public getFilePath(){
      return this.filePath
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
      if (grade.erreichte_punkte) {
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
        "mtknr": 0,
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
      'erreichte_punkte': 0,
      'comment_privat': '',
      'comment_public': ''
    }
  }

  public createSchema(): Observable<any> {
    this.current_project.bewertungsschema = {
      "allgemeine_infos": {
        "notenschluessel": [
          {
            "note": 1.0,
            "wert_min": 90
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
    console.log("writing file")
    writeFile(this.filePath, JSON.stringify(this.current_project), (err) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message);
      }
      else {
        // alert("The file has been succesfully saved");
        console.log("The file has been saved")
      }
    });

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
  public processImport(file): Observable<any> {
    this.current_project;
    return this.http.get(file).map((res: Response) => {
      this.current_project.bewertungsschema = res.json().bewertungsschema;
      return this.current_project;
    })

  }

}
