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
  private course_file = {
    "title": "",
    "path": ""
  };

  private new_course = {
    "title": "",
    "teilnehmer": [],
    "bewertungsschema": {},
    "bewertung": []
  };

  constructor(public dataService: GlobalDataService, public router: Router, private location: Location) { }

  ngOnInit() { }

  goBack(): void {
    this.location.back();
  }

  createCourse(): void {
    var app = require('electron').remote;
    var dialog = app.dialog

    var chooseFolder = new Promise((resolve, reject) => {
      dialog.showOpenDialog({ properties: ['openDirectory'] }, (fileNames) => {
        if (fileNames === undefined) {
          //TODO: Toast
          reject("No filename selected");
        }
        this.course_file.path = fileNames[0];
        this.new_course.title = this.course_file.title;
        //TODO: Toast
        console.log("Speicherort festgelegt.");
        resolve();
      });
    });

    chooseFolder.then(() => {
      if (this.course_file.path) {
        let filePath = this.course_file.path + "/" + this.course_file.title + ".json";
       
        writeFile(filePath, JSON.stringify(this.new_course), (err) => {
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
