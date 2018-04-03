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
      public http: Http) {
  }

  public getLastOpendFiles(): Observable <any> {
    let the_arr = __dirname.split("/");
    the_arr.pop();
    let path = the_arr.join('/') + "/src/";
    
    return this.http.get(path + this.lastOpendFilePath)
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        console.log(res);
        
        this.loadedFiles = JSON.parse(res.text());               
        return JSON.parse(res.text());
      })
      //...errors if any
      .catch((error: any) => Observable.throw(error || 'Reading error'));
  }

  public updateLastOpendFiles(file_path: String): Observable<any>{
      let found = false;
      this.loadedFiles.forEach(file => {
        if(file.path == file_path){
            found = true;
            file.last_opened = new Date();
        }                  
      });

      return of([this.loadedFiles, found]);
  }

  /*
  private createNewLastOpenedFile(file_path: String){
      this.dataService.getCurrentProjectName().subscribe(
          title => {
            let newFile = {
                "last_opened": new Date(),
                "title": title,
                "path": file_path
            }
            this.loadedFiles.push(newFile);
            this.saveLoadedFile();
          }
    );
  }

  private saveLoadedFile(): void{
    writeFile(this.lastOpendFilePath, this.loadedFiles, (err) => {
      if (err) {
        alert("An error ocurred creating the file " + err.message);
      }
      else {
        // alert("The file has been succesfully saved");
        // console.log("The file has been saved")
      }
    });
  }*/
}