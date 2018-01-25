import { Injectable, EventEmitter } from '@angular/core';
import { FileExplorer } from '../models';

import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import "rxjs/add/observable/of";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LastOpened {

    private isInstantiated: boolean;
    private lastOpendFilePath: string = "/assets/data/lastOpend.json";
    private loadedFiles: FileExplorer;

    public constructor(public http: Http) {
        
    }

    public getLastOpendFiles(): Observable<FileExplorer> {
        return this.http.get(this.lastOpendFilePath)
                            // ...and calling .json() on the response to return data
                             .map((res:Response) => this.loadedFiles = res.json())
                             //...errors if any
                             .catch((error:any) => Observable.throw(error.json().error || 'Reading error'));
      }


     
}