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
import {
  log
} from 'util';

import {
  CheckOsService,
} from './checkOS.service';

import {
  ToastService,
} from './toast.service';
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
  private lastOpendFilePath: string = "lastOpened.json";
  public loadedFiles;
  private demoData = [];

  public constructor(
    public http: Http,
    public toastService: ToastService,
    public osService: CheckOsService) {}

  public getLastOpendFiles(): Observable <any> {
    let slash = this.osService.getSlashFormat();
    let the_arr = __dirname.split(slash);
    the_arr.pop();
    let path = the_arr.join(slash) + slash + "src" + slash;

    return this.http.get(path + this.lastOpendFilePath)
      // ...and calling .json() on the response to return data
      .map((res: Response) => {
        this.loadedFiles = JSON.parse(res.text());
        return JSON.parse(res.text());
      })
      //...errors if any
      .catch((error: any) => Observable.throw(error || 'Reading error'));
  }

  public updateLastOpendFiles(file_path: String): Observable <any> {
    let found = false;
    let test = new Observable();
    if (this.loadedFiles == undefined) {
      this.loadedFiles = [];
    }
    this.loadedFiles.forEach(file => {
      if (file.path == file_path) {
        found = true;
        file.last_opened = new Date();
      }
    });
    return of([this.loadedFiles, found]);
  }

  public deleteFileFromList(file_path: String): any {
    if (this.loadedFiles == undefined) {
      this.loadedFiles = [];
    }
    this.loadedFiles.forEach((file, i) => {
      if (file.path == file_path) {
        this.loadedFiles.splice(i, 1);
      }
    });
    this.saveLoadedFile();
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
