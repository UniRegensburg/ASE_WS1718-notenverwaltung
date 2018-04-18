import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import electron from 'electron';
import { log } from 'util';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../providers/toast.service';

import * as hopscotch from 'hopscotch';


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
  private next_thing: boolean = false;
  private last_thing: boolean = false;

  @ViewChild('taskStudent') taskStudent: ElementRef;
  @ViewChild('taskDetails') taskDetails: ElementRef;
  @ViewChild('correctionView') correctionView: ElementRef;

  doTour() {
    var tour = {
      id: "correction-tutorial",
      steps: [
        {
          title: "Korrektur",
          content: "Beim Korrigieren können sie von Aufgabe zu Aufgabe oder von Student zu Student fortschreiten.",
          target: this.taskStudent.nativeElement,
          placement: "bottom",
          arrowOffset: 250
        },
        {
          title: "Ansicht",
          content: "Die Ansicht ist anpassbar je nachdem, ob Sie gesamte Gruppen oder einzelne Studenten korrigieren möchten.",
          target: this.correctionView
            .nativeElement,
          placement: "bottom"
        },
        {
          title: "Aufgaben-Details",
          content: "Aufklappbare Anzeigen ermöglichen Ihnen die für Sie wichtigsten Aufgaben-Details im Blick zu behalten.",
          target: this.taskDetails.nativeElement,
          placement: "left"
        },
      ]
    };

    hopscotch.startTour(tour);

  }

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

  // put current correction as active and displayable
  setCurrentCorrection(): any {
    //TODO: das hier ist nicht schön. der Switch für den Gruppenmodus müsste disabled werden, wenn einer der beiden Fehler von toggleGroupView auftritt
    if (this.current_student == null) {
      this.current_student = this.students[0];
    }
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

  // change between group and single student view
  toggleGroupView(): void {
    let errormsg = "";

    if (!this.no_groups && this.groupmode) {
      try {
        this.setCurrentGroupMembers();
        this.current_student = this.groupmembers[0];
      } catch (err) {
        errormsg = "Dieser Gruppe sind noch keine Studierenden zugeteilt.";
        this.groupmode = !this.groupmode;
      }
    }
    if (!this.no_groups && !this.groupmode) {
      try {
        this.group_index = this.dataService.getGroupIdByName(this.current_student.group);
        this.setCurrentGroupMembers();
      }
      catch (err) {
        errormsg = "Dieser Student ist noch keiner Gruppe zugeteilt.";
        this.groupmode = !this.groupmode;
      }
    }
    try {
      this.setCurrentCorrection();
      this.groupmode = !this.groupmode;
      this.checkLimits();
    }
    catch (err) {
      this.toastService.setError("Gruppenmodus konnte nicht geändert werden: " + errormsg);
    }
  }

  //change correction direction 
  toggleDirection(): void {
    this.correctByTask = !this.correctByTask;
    this.checkLimits();
  }

  //is called when any arrow is clicked
  chevronClick(color, direction): void {
    let param = 0;
    if (direction == "backwards") param = -1;
    if (direction == "forwards") param = 1;
    if (color == "black") this.setNextContinue(param);
    if (color == "pink") this.setNextJump(param);
    if (color == "any") {
      if ((this.show_next && param == 1) || (this.show_previous && param == -1)) this.setNextContinue(param);
      else if ((this.next_thing && param == 1) || (this.last_thing && param == -1)) this.setNextJump(param);
    }
    this.checkLimits();
    this.setCurrentCorrection();
  }

  //if black arrow is clicked go in current direction to next item
  setNextContinue(param): void {
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

  //if pink jump arrow is clicked go on in current direction in correction
  setNextJump(param): void {
    if (this.groupmode && this.correctByTask) {
      if (this.group_index == 0) {
        this.group_index = this.groups.length - 1;
      } else
        if (this.group_index == this.groups.length - 1) {
          this.group_index = 0;
        }
      this.task_index = this.task_index + param;
    }

    else if (this.groupmode && !this.correctByTask) {
      if (this.task_index == this.tasks.length - 1) {
        this.task_index = 0;
      } else if (this.task_index == 0) {
        this.task_index = this.tasks.length - 1;
      }
      this.group_index = this.group_index + param;
    }

    else if (!this.groupmode && this.correctByTask) {
      if (this.student_index == 0) {
        this.student_index = this.students.length - 1;
      } else
        if (this.student_index == this.students.length - 1) {
          this.student_index = 0;
        }
      this.task_index = this.task_index + param;
    }

    else if (!this.groupmode && !this.correctByTask) {
      if (this.task_index == this.tasks.length - 1) {
        this.task_index = 0;
      } else if (this.task_index == 0) {
        this.task_index = this.tasks.length - 1;
      }
      this.student_index = this.student_index + param;
    }

    if (this.groupmode) {
      this.setCurrentGroupMembers();
    } else {
      this.current_student = this.students[this.student_index];
    }
    this.current_task = this.tasks[this.task_index];
  }

  setCurrentGroupMembers(): void {
    this.current_group = this.groups[this.group_index];
    this.groupmembers = this.dataService.getStudentsByGroup(this.current_group.name);
  }

  //check if arrow buttons are active
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
      this.checkPink();
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
      this.checkPink();
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
      this.checkPink();
    }
    else {
      this.checkPink();
    }
  }

  //check if pink jump arrow has to be displayed
  checkPink(): void {
    this.last_thing = false;
    this.next_thing = false;

    if (!this.show_previous) {
      if (this.correctByTask && this.task_index != 0) {
        this.last_thing = true;
      }
      if (this.groupmode && !this.correctByTask && this.group_index != 0) {
        this.last_thing = true;
      }
      if (!this.groupmode && !this.correctByTask && this.student_index != 0) {
        this.last_thing = true;
      }
    }

    if (!this.show_next) {
      if (this.correctByTask && this.task_index != (this.tasks.length - 1)) {
        this.next_thing = true;
      }
      if (this.groupmode) {
        if (!this.correctByTask && this.group_index != (this.groups.length - 1)) {
          this.next_thing = true;
        }
      }
      else if (!this.groupmode) {
        if (!this.correctByTask && this.student_index != (this.students.length - 1)) {
          this.next_thing = true;
        }
      }
    }
  }

  // write points
  saveCorrection(): void {
    this.checkPoints();
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

  //check if entered value is valid
  checkPoints(): void {    
    if (!this.groupmode) {
      if (this.current_correction.erreichte_punkte > this.current_task.max_punkt) {
        this.current_correction.erreichte_punkte = this.current_task.max_punkt;
      }
      else if (this.current_correction.erreichte_punkte < 0) {
        this.current_correction.erreichte_punkte = 0;
      }
    }
    else if (this.groupmode) {
      if (this.current_group.punkte > this.current_task.max_punkt) {
        this.current_group.punkte = this.current_task.max_punkt;
      }
      else if (this.current_group.punkte < 0) {
        this.current_group.punkte = 0;
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.chevronClick("any", "forwards");
    }
    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.chevronClick("any", "backwards");
    }
  }
}
