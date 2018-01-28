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
    private loadedFiles;
    private demoData = [{
        "id": 0,
        "file_name": "DH_WS_17_18.nvwt",
        "last_opened": "07.01.2018",
        "title": "Digital Humanities WS 2017/2018",
        "path": "X"
      }, {
        "id": 1,
        "file_name": "ASE_SS.nvwt",
        "last_opened": "07.01.2018",
        "title": "Digital Humanities WS 2017/2018",
        "path": "X"
      }];
      

    public constructor(public http: Http) {
        
    }

    public getLastOpendFiles() {
        return this.demoData;
    }


     
}