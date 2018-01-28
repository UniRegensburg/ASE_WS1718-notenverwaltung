import { Component, OnInit } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';
import { File } from '../../../models/index'
import { GlobalDataService } from '../../../providers/index';
import { Observable } from 'rxjs/Observable';
import { readdir, stat, writeFile } from 'fs';
import { resolve } from 'path';

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
  private view_mode: boolean = true;

  constructor(
    public dataService: GlobalDataService,
    public router: Router
  ) { }

  ngOnInit() {
   //this.course_oject = new File();
  }

  store(file){
    this.course_oject.path = file.path;
  }

  createCourse(): void{    
    this.course_oject.file_name = this.course_oject.title + ".json";

    let filePath = this.course_oject.path + "/" + this.course_oject.title + ".json";
    let basic_schema = {
        "teilnehmer": [],
        "bewertungsschema": {},
        "bewertung": []
    };
      
    writeFile(filePath, JSON.stringify(basic_schema), (err) => {
        if(err){
            alert("An error ocurred creating the file "+ err.message);            
        }          
        else{
          alert("The file has been succesfully saved");
          this.dataService.getLocalFile(filePath).subscribe(
            data => {
                this.router.navigate(['course/overview']);    
          });
      }
    }); 
  }
  
}
