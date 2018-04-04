import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';
import { File } from '../../models/index'
import { GlobalDataService } from '../../providers/index';
import { Observable } from 'rxjs/Observable';
import { readdir, stat, writeFile } from 'fs';
import { resolve } from 'path';
import { Location } from '@angular/common';

import * as hopscotch from 'hopscotch';

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
    "bewertung": [],
    "gruppen": []

  };

  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('createButton') createButton: ElementRef;



  doTour() {      
    var tour = {
      id: "new-course-tutorial",
      steps: [
        {
          title: "Kursname",
          content: "Möchten Sie einen neuen Kurs erstellen, so können Sie hier den Namen festlegen.",
          target: this.nameInput.nativeElement,
          placement: "bottom"
        },
        {
          title: "Kurs erstellen",
          content: "Beim Erstellen des Kurses werden Sie gebeten einen Speicherort für die verschlüsselte Kursdatei anzugeben.",
          target: this.createButton.nativeElement,
          placement: "bottom"
        },
      ]
    };

    hopscotch.startTour(tour);

  }

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
        let filePath = this.course_file.path + "\\" + this.course_file.title + ".json";
       var saveFile = new Promise((resolve, reject)=> {
           var temp = this.dataService.saveNewFile(filePath,this.new_course)
           setTimeout(()=>{resolve(true);},50);

       });
       saveFile.then(() =>{
           this.dataService.getLocalFile(filePath).subscribe(
           data => {
               this.router.navigate(['course/overview']);
           }
       );
   });

      }
    });
  }

}
