import { Injectable } from '@angular/core';
import { log } from 'util';

import { Http, Response } from '@angular/http';
import { Schema } from '../models/schema';
import { Observable } from 'rxjs/Observable';
import { File } from '../models/index'

import "rxjs/add/observable/of";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { readdir, stat, writeFile } from 'fs';
import { resolve } from 'path';

@Injectable()
export class GlobalDataService {
  public current_project: any; //this is the project data object 
  private pouch: any;
  

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
                         .map((res:Response) => this.current_project = res.json())
                         //...errors if any
                         .catch((error:any) => Observable.throw(error.json().error || 'Reading error'));
  }

  /**
   * 
   * Returns current schema object
   */
  public getCurrentProject(): Schema{
    return this.current_project;
  }

  public createFile(file:any): any{
    let filePath = file.path + "/" + file.title + ".json";
    let basic_schema = {
        "teilnehmer": [],
        "bewertungsschema": {},
        "bewertung": []
    };
    this.current_project = basic_schema;
    writeFile(filePath, JSON.stringify(basic_schema), (err) => {
        if(err){
            alert("An error ocurred creating the file "+ err.message);
            return true;
        }          
        else{
          alert("The file has been succesfully saved");
          return false;
      }
    });    
  }

}
