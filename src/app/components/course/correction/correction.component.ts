import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import electron from 'electron';
import { log } from 'util';
import { ActivatedRoute } from '@angular/router';

declare var require: any;
declare var $: any;

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
  private current_group: any;
  private current_correction: any;

  private tasks: Array<any>;
  private students: Array<any>;
  private grading: Array<any>;
  private groups: Array<any>;
  private groupmembers: Array<any>;

  private task_index: number = 0;
  private student_index: number = 0;
  private group_index: number = 0;

  private groupsExist: boolean = false;
  private no_tasks: boolean = true;
  private no_students: boolean = true;

  private correctByTask: boolean = true;
  private groupmode: boolean = true;
  private show_next: boolean = true;
  private show_previous: boolean = true;

  private sub: any;

  constructor(
    public dataService: GlobalDataService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {
      this.current_project = current_project;
      this.tasks = this.current_project.bewertungsschema.aufgaben;
      this.students = this.current_project.teilnehmer;
      this.grading = this.current_project.bewertung;
      this.groups = this.current_project.gruppen;

      try {
        if (this.tasks.length != 0) {
          this.no_tasks = false;
        }
      } catch (err) {
        console.log("there are no tasks.");
      }

      try {
        this.sub = this.route.params.subscribe(params => {
          this.student_index = Number(params.user_to_edit_id);
        });
      } catch (err) {
        console.log("there are no students");
        console.log(err.message);
      }
      this.no_students = false;

      this.setInitView();

      try {
        this.current_group = this.groups[this.group_index];
        this.setCurrentGroupMembers();
        this.groupsExist = true;

      } catch (err) {
        console.log("there are no groups.")
        this.groupsExist = false;
      }
    });
  }

  setInitView(): void {
    this.groupmode = this.groupsExist;
    this.current_task = this.tasks[this.task_index];
    this.student_index = 0;
    this.current_student = this.students[0];

    this.setCurrentCorrection();
    this.checkLimits();
  }

  setCurrentCorrection(): void {
    if (!this.groupmode) {
      this.grading.forEach(bewertung => {
        if (bewertung.student_id == this.current_student.id) {
          bewertung.einzelwertungen.forEach(einzelwertung => {
            if (einzelwertung.aufgaben_id == this.current_task.id) {
              this.current_correction = einzelwertung;
            }
          });
        }
      });
    }
  }

  toggleGroupView(): void {
    //wenn Gruppen existieren und von der Studenten zur Gruppenansicht gewechselt wird
    if (this.groupsExist && !this.groupmode) {
      this.current_group = this.groups[this.current_student.id]
    }
    //Gruppen existieren und von Gruppenansicht zu Studentenasicht
    else if (this.groupsExist && this.groupmode) {
      this.students.forEach(student => {
        if (student.id == this.groupmembers[0]) {
          this.current_student = student;
        }
      });
    }
    this.groupmode = !this.groupmode;
  }

  toggleDirection(): void {
    this.correctByTask = !this.correctByTask;
  }

  chevronClick(direction): void {
    let param = 0;
    if (direction == "backwards") param = -1;
    if (direction == "forwards") param = 1;
    this.setNextView(param);
    this.checkLimits();
    this.updateView();
  }

  setNextView(param): void {
    if (this.groupmode && this.correctByTask) {
      this.group_index = this.group_index + param;
      this.setCurrentGroupMembers();
    }
    else if (!this.groupmode && this.correctByTask) {
      this.student_index = this.student_index + param;
    }
    else {
      this.task_index = this.task_index + param;
    }
  }

  updateView(): void {
    this.current_task = this.tasks[this.task_index];
    this.current_student = this.students[this.student_index];
    this.current_group = this.groups[this.group_index];
    this.setCurrentCorrection();
  }

  setCurrentGroupMembers(): void {
    let curr_group_name = this.groups[this.group_index].name;
    this.groupmembers = this.dataService.getStudentsByGroup(curr_group_name);
  }

  checkLimits(): void {
    if (!this.correctByTask) {
      if (this.task_index == 0) {
        this.show_previous = false;
      } else {
        this.show_previous = true;
      }
      if (this.task_index + 1 == this.tasks.length) {
        this.show_next = false;
      } else {
        this.show_next = true;
      }
    }

    else if (this.correctByTask && this.groupmode) {
      if (this.group_index == 0) {
        this.show_previous = false;
      } else {
        this.show_previous = true;
      }
      if (this.group_index + 1 == this.groups.length) {
        this.show_next = false;
      } else {
        this.show_next = true;
      }
    }

    else if (this.correctByTask && !this.groupmode) {
      if (this.student_index == 0) {
        this.show_previous = false;
      } else {
        this.show_previous = true;
      }
      if (this.student_index + 1 == this.students.length) {
        this.show_next = false;
      } else {
        this.show_next = true;
      }
    }
  }

  saveCorrection(): void {
    if (this.groupmode) {
      this.grading.forEach(bewertung => {
        this.groupmembers.forEach(groupmember => {
          if (bewertung.student_id == groupmember.id) {
            bewertung.einzelwertungen.forEach(einzelwertung => {
              if (einzelwertung.aufgaben_id == this.current_task.id) {
                einzelwertung.erreichte_punkte = this.current_group.punkte;
              }
            });
          }
        });
      });
    } else if (!this.groupmode) {
      this.grading.forEach(bewertung => {
        if (bewertung.student_id == this.current_student.id) {
          bewertung.einzelwertungen.forEach(einzelwertung => {
            if (einzelwertung.aufgaben_id == this.current_task.id) {
              einzelwertung = this.current_correction;
            }
          });
        }
      });
    }
    this.dataService.setNewCorrection(this.grading)
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.chevronClick("forwards");
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.chevronClick("backwards");
    }
  }
}
