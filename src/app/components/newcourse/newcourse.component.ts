import { Component, OnInit } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';
import { File } from '../../models/index'
import { GlobalDataService } from '../../providers/index';
import { Observable } from 'rxjs/Observable';
import { readdir, stat, writeFile } from 'fs';
import { resolve } from 'path';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home-newCourse',
  templateUrl: './newcourse.component.html',
  styleUrls: ['./newcourse.component.scss']
})
export class NewCourseComponent implements OnInit {
  private last_files: Array<any> = [];
  private course_oject = {
    "file_name": "",
    "title": "",
    "path": ""
  };

  //TODO: an zentrale Stelle:
  private basic_schema = {
    "teilnehmer": [],
    "bewertungsschema": {},
    "bewertung": []
  };

  //TODO: was ist das und was tut das?
  private view_mode: boolean = true;

  constructor(public dataService: GlobalDataService, public router: Router, private location: Location) { }

  ngOnInit() { }

  goBack(): void {
    this.location.back();
  }

  createCourse(): void {
    this.course_oject.file_name = this.course_oject.title + ".json";
    var app = require('electron').remote;
    var dialog = app.dialog

    var chooseFolder = new Promise((resolve, reject) => {
      dialog.showOpenDialog({ properties: ['openDirectory'] }, (fileNames) => {
        if (fileNames === undefined) {
          //TODO: Toast
          reject("No filename selected");
        }
        this.course_oject.path = fileNames[0];
        //TODO: Toast
        console.log("Speicherort festgelegt.");
        resolve();
      });
    });

    chooseFolder.then(() => {
      if (this.course_oject.path) {
        let filePath = this.course_oject.path + "/" + this.course_oject.title + ".json";
       
        writeFile(filePath, JSON.stringify(this.basic_schema), (err) => {
          if (err) {
            //TODO: Toast
            alert("An error ocurred creating the file " + err.message);
          }
          else {
            //TODO: Toast
            alert("The file has been succesfully saved");
            this.dataService.getLocalFile(filePath).subscribe(
              data => {
                this.router.navigate(['course/overview']);
              });
          }
        });
      } 
    });
  }

}
