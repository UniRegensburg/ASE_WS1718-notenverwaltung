import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import electron from 'electron';

declare var require: any;
declare var $: any

var chartJs = require('chart.js');
const {remote} = electron;

@Component({
  selector: 'app-course-correction',
  templateUrl: './correction.component.html',
  styleUrls: ['./correction.component.scss']
})
export class CorrectionComponent implements OnInit {
  @ViewChild("graphCanvas") graphCanvas: ElementRef;

  private current_project: any;
  private current_task: any;

  private tasks: Array<any>;
  private students: Array<any>;
  private grading: Array<any>;

  private correction_mode: string = "student";  //task
  private current_correction: any;
  private screen_mode: boolean;
  private old_window_state:any;
  private task_counter: number;

  /**
  * 
  {
    "student_id": 1,
    "einzelwertungen": [{
      "aufgaben_id": 0,
      "erreichte_punkte": 0,
      "comment_privat": "",
      "comment_public": ""
    }]
  }
  */
  
  constructor(public dataService: GlobalDataService) { 
    
  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {      
      this.current_project = current_project;
      
      this.tasks = this.current_project.bewertungsschema.aufgaben;
      this.students = this.current_project.teilnehmer;
      this.grading = this.current_project.bewertung;

      this.setCurrentTask();             
    });
  }

  setScreenMode():void {    
    this.screen_mode = !this.screen_mode;
    let win = remote.getCurrentWindow();    

    if(this.screen_mode){
      this.old_window_state = win.getBounds();
      win.setBounds({x: 240, y: 192, width: 440, height: 600});
    }
    else{
      win.setBounds(this.old_window_state);
    }
  }

  setCorretionMode(value): void{
    this.correction_mode = value;
  }

  setCurrentTask(): void{
    console.log(this.current_correction);
    
    if(!this.task_counter) this.task_counter = 0
    else this.task_counter++;

    this.current_task = this.tasks[this.task_counter];
    this.current_correction = {
      "aufgaben_id": this.current_task.id,
      "erreichte_punkte": 0,
      "comment_privat": "",
      "comment_public": ""
    }
  }

  getCurrentTask(): any{
    if(this.correction_mode === "student"){
      let single_grade = this.grading[this.grading.length-1].einzelwertungen;
      return single_grade[single_grade.length-1];
    }
    else{
      return ""
    }
  }
}
