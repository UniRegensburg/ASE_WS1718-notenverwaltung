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


  constructor(
    private http: Http) {
  }

  /**
   *
   * @param file_path: path to requested file
   * Loads local schema json file
   * Maps local file to Schema structure
   */
  public getLocalFile(file_path): Observable<Schema> {
    return this.http.get(file_path)
                        // ...and calling .json() on the response to return data
                         .map((res:Response) => {
                            this.current_project = res.json();
                            this.current_project_name = file_path;
                          })
                         //...errors if any
                         .catch((error:any) => Observable.throw(error.json().error || 'Reading error'));
  }

  /**
   *
   * Returns current schema object
   */
  public getCurrentProject(): Observable<Schema>{
    return of(this.current_project);
  }

  public getCurrentProjectName(): Observable<String>{
    return of(this.current_project_name);
  }

  public setNewStudents(student): void{
    this.current_project.teilnehmer.push(student);
  }
  public getParticipants(): Observable<Array<any>>{
      return of(this.current_project.teilnehmer)
  }

}
