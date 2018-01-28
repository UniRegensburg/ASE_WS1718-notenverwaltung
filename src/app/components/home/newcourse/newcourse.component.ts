import { Component, OnInit } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';
import { File } from '../../../models/index'
import { GlobalDataService } from '../../../providers/index';
import { Observable } from 'rxjs/Observable';


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

    /*const promise = new Promise((resolve, reject) => {
      this.dataService.createFile(this.course_oject);
    });

    promise.then((res) => {
      console.log(res);
    });
    promise.catch((err) => {
       console.log(err);    
    });*/

    var testO = new Observable(() => {
      this.dataService.createFile(this.course_oject);
    })

    testO.subscribe((datadares)=>{
      console.log(res);
    });
    
  }
  
}
