import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import electron from 'electron';
import { log } from 'util';

import { ActivatedRoute } from '@angular/router';


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

  private groupview: boolean = true;
  private correctByTasks: boolean = true;

  private current_project: any;
  private current_task: any;
  private current_student: any;
  private current_group: any;

  private tasks: Array<any>;
  private students: Array<any>;
  private grading: Array<any>;
  private groups: Array<any>;
  private groupmembers: Array<any>;

  private correction_mode: string = 'student'; //task
  private current_correction: any;
  private old_window_state: any;

  private task_counter: number;
  private student_counter: number;
  private group_counter: number;
  private current_student_grading;
  private gruppenpunkte: number = 10;

  private no_tasks: boolean = true;
  private no_students: boolean = true;
  private show_next: boolean = true;
  private show_previous: boolean = true;

  private sub: any;

  constructor(
    public dataService: GlobalDataService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    try {
      this.dataService.getCurrentProject().subscribe(current_project => {
        this.current_project = current_project;
        this.tasks = this.current_project.bewertungsschema.aufgaben;
        this.students = this.current_project.teilnehmer;
        this.grading = this.current_project.bewertung;
        this.groups = this.current_project.gruppen;
        this.group_counter = 0;

        try {
          if (this.tasks.length != 0) {
            this.no_tasks = false;
          }
        } catch (err) {
          console.log("there are no tasks.");
        }

        try {
          this.sub = this.route.params.subscribe(params => {
            this.task_counter = 0;
            this.student_counter = Number(params.user_to_edit_id);
            if (Number.isNaN(this.student_counter)) {
              this.student_counter = 0;
            }
          });
          this.setCurrentTask('first');
          this.no_students = false;
        } catch (err) {
          console.log("there are no students.");
        }

        try {
          this.current_group = this.groups[this.group_counter];
          this.setCurrentGroupMembers();

        } catch (err) {
          console.log("there are no groups.")
        }
      });
    } catch (err) {
      console.log("correction compoment could not be loaded.")
    }
  }

  setCorrectionMode(): void {
    if (this.correctByTasks) {
      this.correction_mode = "task";
    } else {
      this.correction_mode = "student";
    }
    this.correctByTasks = !this.correctByTasks;
    this.updateShowPermissions();
  }

  setCurrentGroupMembers(): void {
    let curr_group_name = this.groups[this.group_counter].name;
    this.groupmembers = this.dataService.getStudentsByGroup(curr_group_name);
  }

  changeThing(entity, direction): void {
    if (entity === "group") {
      if (direction === "previous" && this.group_counter - 1 >= 0) {
        this.group_counter = this.group_counter - 1;
      }
      if (direction === "next" && this.group_counter + 1 < this.groups.length) {
        this.group_counter = this.group_counter + 1;
      }
      this.checkShowings("group");
      this.current_group = this.groups[this.group_counter];
    }

    if (entity === "task") {
      if (direction === "previous" && this.task_counter - 1 >= 0) {
        this.task_counter = this.task_counter - 1;
      }
      if (direction === "next" && this.task_counter + 1 < this.tasks.length) {
        this.task_counter = this.task_counter + 1;
      }
      this.checkShowings("task");
      this.current_task = this.tasks[this.task_counter];
    }
  }

  checkShowings(mode): void {
    if (mode === "task") {
      if (this.task_counter == 0) {
        this.show_previous = false;
      } else {
        this.show_previous = true;
      }
      if (this.task_counter + 1 == this.tasks.length) {
        this.show_next = false;
      } else {
        this.show_next = true;
      }
    }

    if (mode === "group") {
      if (this.group_counter == 0) {
        this.show_previous = false;
      } else {
        this.show_previous = true;
      }
      if (this.group_counter + 1 == this.groups.length) {
        this.show_next = false;
      } else {
        this.show_next = true;
      }
    }
  }

  setCurrentTask(direction): void {
    if (this.correction_mode == "student") {
      if ((direction === "next") && (this.show_next)) {
        this.setNext(this.task_counter, this.student_counter, this.tasks, this.students);
      }
      if ((direction === "previous") && (this.show_previous)) {
        this.setPrevious(this.task_counter, this.student_counter, this.tasks, this.students);
      }
    }
    else {
      if ((direction === "next") && (this.show_next)) {
        this.setNext(this.student_counter, this.task_counter, this.students, this.tasks);
      }
      else {
        if ((direction === "next") && (this.show_next)) {
          this.setNext(this.student_counter, this.task_counter, this.students, this.tasks);
        }
        if ((direction === "previous") && (this.show_previous)) {
          this.setPrevious(this.student_counter, this.task_counter, this.students, this.tasks);
        }
      }
    }
    this.updateShowPermissions();
    this.setCurrentCorrection();
  }

  updateShowPermissions(): void {

    if (this.correction_mode === "student") {
      if (this.student_counter >= this.students.length - 1) {
        this.show_next = false;
      }
      else {
        this.show_next = true;
      }

      if (this.student_counter <= 0) {
        this.show_previous = false;
      }
      else {
        this.show_previous = true;
      }
    }
    else {
      if ((this.student_counter >= this.students.length - 1) && (this.task_counter >= this.tasks.length - 1)) {
        this.show_next = false;
      }
      else {
        this.show_next = true;
      }

      if ((this.student_counter <= 0) && (this.task_counter <= 0)) {
        this.show_previous = false;
      }
      else {
        this.show_previous = true;
      }
    }

  }

  setNext(prim_counter, sec_counter, prim, sec): void {
    if (prim_counter < prim.length) {
      prim_counter = prim_counter + 1;
    }
    if (prim_counter >= prim.length) {
      prim_counter = 0;
      sec_counter = sec_counter + 1;
      if (sec_counter >= sec.length) {
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

  setCounters(prim_counter, sec_counter) {
    if (this.correction_mode == "student") {
      this.task_counter = prim_counter;
      this.student_counter = sec_counter;
    }
    else {
      this.student_counter = prim_counter;
      this.task_counter = sec_counter;
    }
  }

  setCurrentCorrection() {
    this.grading.forEach(student => {
      if (student.student_id == this.student_counter) {
        this.current_student = student;
      }
    });

    this.current_student["einzelwertungen"].forEach(correction => {
      if (correction.aufgaben_id == this.task_counter) this.current_correction = correction;
    });

    this.current_task = this.tasks[this.task_counter];
    this.current_student = this.students[this.student_counter];

  }

  saveCorrection(): void {
    this.dataService.setNewCorrection(this.grading)
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
