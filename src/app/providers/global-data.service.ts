import { Injectable } from '@angular/core';
import { log } from 'util';

import { Http, Response } from '@angular/http';
import { Schema } from '../models/schema';
import { Observable } from 'rxjs/Observable';

import "rxjs/add/observable/of";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare var require: any;

var PouchDB = require('pouchdb');

@Injectable()
export class GlobalDataService {
  public current_project: Schema; //this is the project data object 
  private pouch: any;

  constructor(private http: Http) {
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

}
