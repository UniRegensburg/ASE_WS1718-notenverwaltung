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
import { log } from 'util';

declare var require: any;
declare var $: any

const { remote } = electron;

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

  private tasks: Array < any > ;
  private students: Array < any > ;
  private grading: Array < any > ;

  private correction_mode: string = 'student'; //task
  private current_correction: any;
  private screen_mode: boolean;
  private old_window_state: any;

  private task_counter: number;
  private student_counter: number;
  private current_student_grading;
  /**
  *
  {
    'student_id': 1,
    'einzelwertungen': [{
      'aufgaben_id': 0,
      'erreichte_punkte': 0,
      'comment_privat': '',
      'comment_public': ''
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
      this.setCurrentTask('next');
    });
  }

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

  setCorretionMode(value): void {
    this.correction_mode = value;
  }

  setCurrentTask(direction): void {

    this.setCounter(direction);

    this.current_task = this.tasks[this.task_counter];
    this.current_student = this.students[this.student_counter];

    console.log(this.grading);

    if(this.grading.length == 0){
     this.createNewStudentGrading();
    }
    else{
      let found_student_grading = false;

      //get the current_student_grading based on current student
      this.grading.forEach(element =>{
        if(element.student_id == this.current_student.id){
          this.current_student_grading = element;
          found_student_grading = true;
        }
      });

      //if current current_student_grading is not already created for student
      if(!found_student_grading){
        this.createNewStudentGrading();
      }

      let found_task_grading = false;
      console.log(this.current_student_grading);

      //get the current current_correction for current task
      this.current_student_grading['einzelwertungen'].forEach(element =>{
        if(element.aufgaben_id == this.current_task.id){
          this.current_correction = element;
          found_task_grading = true;
        }
      });

      if(!found_task_grading){
        this.createCurrentCorrection();
      }
    }
  }

  getCurrentTask(): any {
    if (this.correction_mode === 'student') {
      let single_grade = this.grading[this.grading.length - 1].einzelwertungen;
      return single_grade[single_grade.length - 1];
    } else {
      return ''
    }
  }

  setCounter(direction):void{
    if ((this.task_counter == null) || (this.student_counter == null)) {
        this.task_counter = 0;
        this.student_counter = 0;
    }
    else{
      if (this.correction_mode === 'student') {
        if(direction === 'next'){
          this.task_counter = this.task_counter +1;
        }
        if(direction === 'previous'){
           this.task_counter = this.task_counter -1;
        }
      } else {
        if(direction === 'next'){
          this.student_counter = this.student_counter +1;
        }
        if(direction === 'previous'){
           this.student_counter = this.student_counter -1;
        }
      }
    }
  }

  createNewStudentGrading():void{
     this.current_student_grading = {
        'student_id': this.current_student.id,
        'einzelwertungen': []
      };
      this.grading.push(this.current_student_grading);
      this.createCurrentCorrection();
  }

  createCurrentCorrection(): void{
    this.current_correction = {
      'aufgaben_id': this.current_task.id,
      'erreichte_punkte': 0,
      'comment_privat': '',
      'comment_public': ''
    }
    this.current_student_grading['einzelwertungen'].push(this.current_correction);
    console.log("2", this.current_student_grading);
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
