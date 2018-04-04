import {
  Injectable,
  EventEmitter
} from '@angular/core';
import {
  FileExplorer
} from '../models';

import {
  Observable
} from 'rxjs/Observable';
import {
  Http,
  Response
} from '@angular/http';
import { of
} from 'rxjs/observable/of';
import "rxjs/add/observable/of";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { log } from 'util';

import { CheckOsService } from './checkOS.service';

import {
    readdir,
    stat,
    writeFile
  } from 'fs';
  import {
    resolve
  } from 'path';

@Injectable()
export class LastOpened {

  private isInstantiated: boolean;
  private lastOpendFilePath: string = "assets/data/lastOpend.json";
  private loadedFiles;
  private demoData = [];

  public constructor(
      public http: Http,
      public osService: CheckOsService) {
  }

  public getLastOpendFiles(): Observable <any> {
    let slash = this.slashFormat();
    console.log(slash);
    
    let the_arr = __dirname.split(slash);
    the_arr.pop();
    let path = the_arr.join(slash) + slash + "src" + slash;
    console.log("PATH", slash);    
    return this.http.get(path + this.lastOpendFilePath)
      // ...and calling .json() on the response to return data
      .map((res: Response) => {        
        this.loadedFiles = JSON.parse(res.text());               
        return JSON.parse(res.text());
      })
      //...errors if any
      .catch((error: any) => Observable.throw(error || 'Reading error'));
  }

  slashFormat(): string {
    let returnValue;
    console.log(process.platform);
    if(process.platform == 'win32'){
        returnValue = '\\';
    }
    else{
        returnValue = '/';
    }
    return returnValue;
}

  public updateLastOpendFiles(file_path: String): Observable<any>{
      let found = false;
      let test = new Observable();
        this.getLastOpendFiles().subscribe(data=>{
          this.loadedFiles.forEach(file => {
            if(file.path == file_path){
                found = true;
                file.last_opened = new Date();
            }        
             
          });
        });

      return of([this.loadedFiles, found]);
  }

  public deleteFileFromList(file_path: String): Observable<any>{
    this.loadedFiles.forEach((file,i) => {
      if(file.path == file_path){
        this.loadedFiles.splice(i, 1);
      }
    });
    return of(this.loadedFiles);
  }
}