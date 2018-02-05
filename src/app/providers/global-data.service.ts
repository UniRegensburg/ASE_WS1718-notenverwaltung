import { Injectable } from '@angular/core';
import { log } from 'util';

import { Http, Response } from '@angular/http';
import { Schema } from '../models/schema';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { File } from '../models/index'

import "rxjs/add/observable/of";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { readdir, stat, writeFile } from 'fs';
import { resolve } from 'path';

@Injectable()
export class GlobalDataService {
  public current_project: any; //this is the project data object
  public current_project_name: any;
  private pouch: any;
  public teilnehmer: Array<any>;
  private temp: Array<any>;
  private filePath: any;

  constructor(
    private http: Http) {
  }

   /**
   * Getter methods to load local projects 
   * and to dispatch data to each component
   */

  public getLocalFile(file_path): Observable<Schema> {
    return this.http.get(file_path)
                        // ...and calling .json() on the response to return data
                         .map((res:Response) => {
                            this.current_project = res.json();
                            this.current_project_name = file_path;
                            this.filePath = file_path;
                            // console.log(file_path.split('\\').pop().split('/').pop());
                          })
                         //...errors if any
                         .catch((error:any) => Observable.throw(error.json().error || 'Reading error'));
  }

  public getCurrentProject(): Observable<Schema>{
    this.checkCurrentValidity();
    return of(this.current_project);
  }

  public getCurrentProjectName(): Observable<String>{
    return of(this.current_project_name);
  }

  public getParticipants(): Observable<Array<any>>{
      return of(this.current_project.teilnehmer)
  }

  public getStudentGrading(): Observable<any>{
    let gradings = this.current_project.bewertung;
    let task_counter = this.current_project.bewertungsschema.aufgaben.length;    

    gradings.forEach(grading => {      
      this.current_project.teilnehmer.forEach(student => {
        student.grade = 0;
        student.finisehd = 0;
        
        if(student.id == grading.student_id){
          grading.grade = this.getCurrentStudentGrade(grading);
          grading.finisehd = task_counter / grading.einzelwertungen.length;
        }
      });
      
    });

    return of(this.current_project.teilnehmer);
  }

  private getCurrentStudentGrade(student): number{
    let sum_grades = 0;

    student.einzelwertungen.forEach(grade => {
      sum_grades = sum_grades + grade.erreichte_punkte;
    });
    
    return this.getGradeByScale(sum_grades);
  }

  private getGradeByScale(sum_grade): number{
    let grading_schema = this.current_project.bewertungsschema.allgemeine_infos.notenschluessel;
    let returnValue = 0;    

    grading_schema.forEach(element => {
      if(element.wert_min <= sum_grade){
        returnValue = element.note;
      }
    });

    return returnValue;
  }

   /**
   * Validations methods
   */

  private checkCurrentValidity(): void{
    if(this.current_project.bewertung.length == 0){
      this.createNewStudentGrading();
    }   
  }

  private createNewStudentGrading(): any {
    let gradings = [];

    this.current_project.teilnehmer.forEach(student => {
      let single_student_corretion = {
        'student_id': student.id,
        'einzelwertungen': this.createCurrentCorrection()
      };
      gradings.push(single_student_corretion)
    });    

    this.setNewGrading(gradings);
  }

  private createCurrentCorrection(): any {
    let corretions = [];

    this.current_project.bewertungsschema.aufgaben.forEach(task => {
      let single_corretion = {
        'aufgaben_id': task.id,
        'erreichte_punkte': 0,
        'comment_privat': '',
        'comment_public': ''
      }
      corretions.push(single_corretion);      
    });
    return corretions;
  }

  private saveJson(): void{
    writeFile(this.filePath, JSON.stringify(this.current_project), (err) => {
        if(err){
            alert("An error ocurred creating the file "+ err.message);
        }
        else{
          // alert("The file has been succesfully saved");
          console.log("The file has been saved")
      }
    });

  }

  /**
   * Setter methods to update global project
   */

  public setNewStudents(student): void{
    this.current_project.teilnehmer.push(student);
    this.saveJson();
  }

  public setNewGrading(grading): void{
    this.current_project.bewertung = grading;
    this.saveJson();
  }

}
