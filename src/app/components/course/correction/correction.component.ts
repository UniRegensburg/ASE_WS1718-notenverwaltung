import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import electron from 'electron';
import { log } from 'util';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../providers/toast.service';

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

  private no_groups: boolean = true;
  private no_tasks: boolean = true;
  private no_students: boolean = true;

  private correctByTask: boolean = true;
  private groupmode: boolean = true;
  private show_next: boolean = true;
  private show_previous: boolean = true;

  constructor(public dataService: GlobalDataService, private route: ActivatedRoute, public toastService: ToastService) { }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {
      this.current_project = current_project;
      this.tasks = this.current_project.bewertungsschema.aufgaben;
      this.students = this.current_project.teilnehmer;
      this.grading = this.current_project.bewertung;
      this.groups = this.current_project.gruppen;

      try {
        this.task_index = 0;
        this.current_task = this.tasks[this.task_index];
        this.no_tasks = false;
      } catch (err) {
        this.no_tasks = true;
        console.log("there are no tasks.");
      }

      try {
        this.student_index = 0;
        this.current_student = this.students[this.student_index];
        if (this.current_student != null) {
          this.no_students = false;
        }
      } catch (err) {
        this.no_students = true;
        console.log("there are no students");
        console.log(err.message);
      }

      try {
        this.group_index = 0;
        this.current_group = this.groups[this.group_index];
        this.setCurrentGroupMembers();
        if (this.current_group != null) {
          this.no_groups = false;
        }
      } catch (err) {
        this.no_groups = true;
        console.log("there are no groups.")
      }
    });

    if (!this.no_tasks && !this.no_students) {
      this.groupmode = !this.no_groups;
      this.setCurrentCorrection();
      this.checkLimits();
    }
  }

  setCurrentCorrection(): any {
    this.grading.forEach(bewertung => {
      if (bewertung.student_id == this.current_student.id) {
        bewertung.einzelwertungen.forEach(einzelwertung => {
          if (einzelwertung.aufgaben_id == this.current_task.id) {
            this.current_correction = einzelwertung;
            return true;
          }
        });
      }
    });

  }


  toggleGroupView(): void {
    console.log("lok1")
    console.log("no groups", this.no_groups)
    console.log("gm:", this.groupmode)
    //wenn Gruppen existieren und von der Studenten zur Gruppenansicht gewechselt wird
    if (!this.no_groups && !this.groupmode) {
      try {
        this.group_index = this.dataService.getGroupIdByName(this.current_student.group);
        this.setCurrentGroupMembers();
      }
      catch (err) {
        //Toast: dieser Studierende ist keiner Gruppe zugeteilt
      }
    }
    //Gruppen existieren und von Gruppenansicht zu Studentenasicht
    else if (!this.no_groups && this.groupmode) {
      this.current_student = this.students[this.current_group.studenten[0]];
    }
    this.setCurrentCorrection();
    this.groupmode = !this.groupmode;
    this.checkLimits();
  }

  toggleDirection(): void {
    this.correctByTask = !this.correctByTask;
    this.checkLimits();
  }

  chevronClick(direction): void {
    this.setNextView(direction);
    this.checkLimits();
    this.setCurrentCorrection();
  }

  setNextView(direction): void {
    let param = 0;
    if (direction == "backwards") param = -1;
    if (direction == "forwards") param = 1;
    if (this.groupmode && this.correctByTask) {
      this.group_index = this.group_index + param;
      this.setCurrentGroupMembers();
    }
    else if (!this.groupmode && this.correctByTask) {
      this.student_index = this.student_index + param;
      this.current_student = this.students[this.student_index];
    }
    else {
      this.task_index = this.task_index + param;
      this.current_task = this.tasks[this.task_index];
    }
  }

  setCurrentGroupMembers(): void {
    this.current_group = this.groups[this.group_index];
    this.groupmembers = this.dataService.getStudentsByGroup(this.current_group.name);
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
