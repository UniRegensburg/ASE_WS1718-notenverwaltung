import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { GlobalDataService, ToastService } from '../../../../providers/index'
import {
  ActivatedRoute, Router
} from '@angular/router';

import * as hopscotch from 'hopscotch';

declare var require: any;
declare var $: any;

@Component({
  selector: 'app-students-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;
  private sub: any;
  private participants: any;
  private current_student: any;
  private current_student_index: number;
  private create_new_student_mode: boolean = false;


  @ViewChild('detailsView') detailsView: ElementRef;
  @ViewChild('saveDelete') saveDelete: ElementRef;
  @ViewChild('cancelButton') cancelButton: ElementRef;



  doTour() {
    var tour = {
      id: "results-tutorial",
      steps: [
        {
          title: "Detailansicht",
          content: "Hier haben Sie die Möglichkeit die Details eines Studenten zu bearbeiten.",
          target: this.detailsView.nativeElement,
          placement: "left"
        },
        {
          title: "Speichern und Löschen",
          content: "Eventuelle Änderungen können Sie hier speichern. Ebenso besteht die Möglichkeit einen Studenten komplett zu löschen.",
          target: this.saveDelete.nativeElement,
          placement: "bottom"
        },
        {
          title: "Abbrechen",
          content: "Ein Klick auf Abbrechen bringt Sie zur Teilnehmerübersicht.",
          target: this.cancelButton.nativeElement,
          placement: "bottom"
        },
      ]
    };

    hopscotch.startTour(tour);

  }

  constructor(
    public dataService: GlobalDataService,
    private route: ActivatedRoute,
    public router: Router,
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.dataService.getCurrentProject().subscribe(current_project => {
        this.participants = current_project["teilnehmer"];
        if (params) {
          if (params.student_id == "createNewStudent") {
            this.getNewStudent();
            this.create_new_student_mode = true;
          }
          else {
            this.setCurrentStudent(params.student_id);
          }
        }
      });
    });
  }

  setCurrentStudent(id): void {
    this.participants.forEach(student => {
      if (student.id == id) {
        this.current_student = student;
        this.current_student_index = id;
      }
    });

  }

  saveStudent(): void {
    let check = true;
    this.participants.forEach((existing_student) => {
      if (existing_student.mtknr == this.current_student.mtknr) {
        check = false
      }
    });
    if (check == true) {
      this.dataService.setNewStudentsComplete(this.participants)
      this.router.navigate(['/course/students']);
    }
    else {
      this.toastService.setError("Student mit der Matrikelnummer " + this.current_student.mtknr + " ist bereits in der Teilnehmerliste.")
    }
  }
  getNewStudent(): void {
    this.dataService.createNewStudent().subscribe(student => {
      this.current_student = student;
    });
  }

  addStudent(): void {
    let check = true;
    this.participants.forEach((existing_student) => {
      if (existing_student.mtknr == this.current_student.mtknr) {
        check = false
      }
    });
    if (check == true) {
      this.dataService.setNewStudents(this.current_student);
      this.router.navigate(['/course/students']);
    }
    else {
      this.toastService.setError("Student mit der Matrikelnummer " + this.current_student.mtknr + " ist bereits in der Teilnehmerliste.")
    }
  }

  deleteStudent(): void {
    this.participants.splice(this.current_student_index, 1);
    this.dataService.setNewStudents(this.participants);
    this.router.navigate(['/course/students']);
  }

}
