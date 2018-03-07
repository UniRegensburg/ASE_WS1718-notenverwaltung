import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import {
  GlobalDataService
} from '../../../providers/index';
import {
  AfterViewInit
} from '@angular/core/src/metadata/lifecycle_hooks';
import electron from 'electron';
import {
  log
} from 'util';

import {
  ActivatedRoute
} from '@angular/router';


declare var require: any;
declare var $: any

const {
  remote
} = electron;

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

@Component({
  selector: 'app-course-correction',
  templateUrl: './correction.component.html',
  styleUrls: ['./correction.component.scss']
})
export class CorrectionComponent implements OnInit {
  @ViewChild('graphCanvas') graphCanvas: ElementRef;

  private current_project: any;
  private current_task: any;
  private current_student: any;

  private tasks: Array <any> ;
  private students: Array <any> ;
  private grading: Array <any> ;

  private correction_mode: string = 'student'; //task
  private current_correction: any;
  private screen_mode: boolean = true;
  private old_window_state: any;

  private task_counter: number;
  private student_counter: number;
  private current_student_grading;

  private show_next: boolean = true;
  private show_previous: boolean = true;

  private sub: any;

  constructor(
    public dataService: GlobalDataService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {
      this.current_project = current_project;
      this.tasks = this.current_project.bewertungsschema.aufgaben;
      this.students = this.current_project.teilnehmer;
      this.grading = this.current_project.bewertung;   

      this.sub = this.route.params.subscribe(params => {
        if (params) {
          this.task_counter = 0;
          this.student_counter = Number(params.user_to_edit_id);
          if (Number.isNaN(this.student_counter)) this.student_counter = 0;
        }
        this.setCurrentTask('next');
      });
    });
  }

  /* Currently not used
  setScreenMode(): void {
    this.screen_mode = !this.screen_mode;
    let win = remote.getCurrentWindow();

    if (this.screen_mode) {
      this.old_window_state = win.getBounds();
      win.setBounds({
        x: 240,
        y: 192,
        width: 440,
        height: 600
      });
    } else {
      win.setBounds(this.old_window_state);
    }
  }
  */

  
  setCorretionMode(value): void {
    this.correction_mode = value;
    this.updateShowPermissions();
  }
  

  setCurrentTask(direction): void {    
    if (this.correction_mode == "student"){
      if ((direction === "next") && (this.show_next)) {
        this.setNext(this.task_counter, this.student_counter, this.tasks, this.students);
      }
      if ((direction === "previous") && (this.show_previous)) {
        this.setPrevious(this.task_counter, this.student_counter, this.tasks, this.students);
      }
    }
    else{
      if ((direction === "next") && (this.show_next)) {
        this.setNext(this.student_counter, this.task_counter, this.students, this.tasks);
      }
      if ((direction === "previous") && (this.show_previous)) {
        this.setPrevious(this.student_counter, this.task_counter, this.students, this.tasks);
      }      
    }
    this.updateShowPermissions();
    this.setCurrentCorretion();
  }

  updateShowPermissions(): void{
    
    if(this.correction_mode === "student"){
      if(this.student_counter >= this.students.length-1){
        this.show_next = false;
      }
      else{
        this.show_next = true;
      }

      if(this.student_counter <= 0){
        this.show_previous = false;
      }
      else{
        this.show_previous = true;
      }
    }
    else{    
      if((this.student_counter >= this.students.length-1) && (this.task_counter >= this.tasks.length-1)){
        this.show_next = false;
      }
      else{
        this.show_next = true;
      } 

      if((this.student_counter <= 0) && (this.task_counter <= 0)){
        this.show_previous = false;
      }
      else{
        this.show_previous = true;
      }
    }

  }

  setNext(prim_counter, sec_counter, prim, sec): void{
    if(prim_counter < prim.length){
      prim_counter = prim_counter + 1;
    }
    if(prim_counter >= prim.length){
      prim_counter = 0;
      sec_counter = sec_counter + 1;
      if(sec_counter >= sec.length){
        sec_counter = sec.length - 1;
        prim_counter = prim.length - 1;
      }
    }
    this.setCounters(prim_counter, sec_counter);
  }

  setPrevious(prim_counter, sec_counter, prim, sec): void {
    if (prim_counter >= 0) {
      prim_counter = prim_counter - 1;
    }
    if (prim_counter < 0) {
      prim_counter = prim.length - 1;
      sec_counter = sec_counter - 1;
      if (sec_counter <= 0) {
        sec_counter = 0;
        prim_counter = 0;
      }
    }
    this.setCounters(prim_counter, sec_counter);
  }

  setCounters(prim_counter, sec_counter){
    if(this.correction_mode == "student"){
      this.task_counter = prim_counter;
      this.student_counter = sec_counter;
    }
    else{
      this.student_counter = prim_counter;
      this.task_counter = sec_counter;
    }
  }
  
  setCurrentCorretion() {    
    this.grading.forEach(student => {
      if (student.student_id == this.student_counter){        
        this.current_student = student;
      }
    });
    
    this.current_student["einzelwertungen"].forEach(correction => {
      if (correction.aufgaben_id == this.task_counter) this.current_correction = correction;
    });

    this.current_task = this.tasks[this.task_counter];
    this.current_student = this.students[this.student_counter];

  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.setCurrentTask('next');
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.setCurrentTask('previous');
    }
  }
}
