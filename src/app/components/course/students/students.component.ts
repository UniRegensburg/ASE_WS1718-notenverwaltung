import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'ts-xlsx'
import { GlobalDataService } from '../../../providers/index'
import { ActivatedRoute, Router } from '@angular/router';
import { SearchStudentPipe } from '../../../pipes/index';
import { log } from 'util';
import { ToastService } from '../../../providers/toast.service';

import * as hopscotch from 'hopscotch';

declare var require: any;
declare var $: any;

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})

export class StudentsComponent implements OnInit {

  private current_project: any;
  private participants: Array<any>;
  private groups: Array<any>;
  private group_mode: boolean = false;
  private no_data_available: boolean = true;
  public searchValue: string;
  private studentNumber: number;

  @ViewChild('studentsTable') studentsTable: ElementRef;
  @ViewChild('groupsButton') groupsButton: ElementRef;
  @ViewChild('importAdd') importAdd: ElementRef;



  doTour() {
    var tour = {
      id: "students-tutorial",
      steps: [
        {
          title: "Teilnehmer",
          content: "In dieser Tabelle können Sie die Teilnehmer ihres Kurses verwalten.",
          target: this.studentsTable.nativeElement,
          placement: "left"
        },
        {
          title: "Gruppen",
          content: "Sollten Sie Gruppen bewerten, können Sie diese hier optional erstellen und in der unten aufgeführten Tabelle den Studenten zuweisen.",
          target: this.groupsButton.nativeElement,
          placement: "bottom"
        },
        {
          title: "Hinzufügen und Importieren",
          content: "Es steht ihnen frei, Teilnehmer einzeln hinzuzufügen oder aus einer Teilnehmerliste zu importieren. Beachten Sie hierzu die auch die Example_Teilnehmerliste - Datei.",
          target: this.importAdd.nativeElement,
          placement: "bottom"
        },
      ]
    };

    hopscotch.startTour(tour);

  }

  constructor(
    public dataService: GlobalDataService,
    private searchStudentPipe: SearchStudentPipe,
    private changeDetectorRef: ChangeDetectorRef,
    public toastService: ToastService,
    public router: Router,
    public zone: NgZone) { }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {
      this.current_project = current_project;

      try {
        this.participants = this.current_project.teilnehmer;
        this.changeDetectorRef.detectChanges();
        if (!this.current_project.groups) {
          this.getGroups();
        }
        if (this.participants.length == 0) {
          this.no_data_available = true;
        }
        else {
          this.no_data_available = false;
        }
      }
      catch (err) {
        this.no_data_available = true;
      }

    });

  }

  //*********************************  FUNCTIONS ********************************************** */
  deleteStudent(participant): void {
    this.participants.forEach((student, i) => {
      if (student.id == participant.id) {
        this.participants.splice(i, 1);
      }
    });
    this.dataService.setNewStudentsComplete(this.participants);
    this.searchValue = "";
  }

  openDialog(): void {
    var app = require('electron').remote;
    var dialog = app.dialog
    var fs = require('fs')
    dialog.showOpenDialog((fileNames) => {
      if (fileNames === undefined) {
        console.log("No file selected")
        return;
      }
      this.processData(fileNames[0]);
    });
  }

  processData(filepath): void {
    // Get the correct sheet
    var workbook = XLSX.readFile(filepath)
    var sheetname = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[sheetname];

    // Check where the table starts
    var row = 0
    var cell = 1
    var address = String.fromCharCode(65 + row) + cell
    while (worksheet[address].v != "Nr") {
      cell += 1
      if (cell === 20) {
        cell = 1
        row += 1
      }
      address = String.fromCharCode(65 + row) + cell;
    }
    // Move to the first row
    cell += 1
    address = String.fromCharCode(65 + row) + cell;
    // as long as there are numbers (= students)
    var students = []
    while (worksheet[address].v !== "") {
        let user_id = 0;
        try{
          if(this.current_project.teilnehmer.length!=0){
            user_id = this.current_project.teilnehmer[this.current_project.teilnehmer.length -1].id + 1;
          }
          else{
            user_id = students.length
          }
        }
        finally{
      var student = {
        "id": user_id,
        "mtknr": 0,
        "name": "",
        "vorname": "",
        "studiengang": "",
        "fachsemester": 0,
        "mail": "",
        "status": ""
      }}
      // move through the cells, saving data accordingly
      for (var i = 0; i < 8; i++) {
        address = String.fromCharCode(65 + row + i) + cell;
        switch (i) {
          case 0:
            break;
          case 1:
            student.mtknr = worksheet[address].v
            break;
          case 2:
            student.name = worksheet[address].v
            break;
          case 3:
            student.vorname = worksheet[address].v
            break;
          case 4:
            student.studiengang = worksheet[address].v
            break;
          case 5:
            student.fachsemester = worksheet[address].v
            break;
          case 6:
            student.mail = worksheet[address].v
            break;
          case 7:
            student.status = worksheet[address].v
            break;
        }
      }
        let check = true
        let temp = this.dataService.checkMtknr(student.mtknr)
        if(temp == false){
          check= false
        }

      students.forEach((existing_student)=>{
          if(existing_student.mtknr == student.mtknr){
              check = false
          }
      });
      cell += 1
      address = String.fromCharCode(65 + row) + cell;
      if(check == true){
          students.push(student)
          this.dataService.setNewStudents(student);
      }
    }
    this.studentNumber = students.length;
    this.zone.run(() => {
      this.dataService.createGroups();
      this.ngOnInit();
      if(this.studentNumber!=0){
      this.toastService.success("Erfolgreicher Import von " + this.studentNumber + " neuen Studierenden.");
      }
      else{
        this.toastService.setError("Konnte keine Studierenden importieren.")
      }
    });
  }

  //***************************   Group Functionality   ******************************//
  onKey(event: any) {
    this.dataService.setNewGroupsComplete(this.current_project.gruppen);
  }

  getGroups(): void {
    this.dataService.getStudentsWithGroup().subscribe(studentsWithGroup => {
      this.participants = studentsWithGroup;
      this.groups = this.current_project.gruppen;
    });
  }

  changeDetected(event): void {
    this.dataService.setNewGroups(this.participants);
  }

  deleteGroup(element_index): void {
    this.groups.splice(element_index, 1);
  }

  addGroup(): void {
    this.groups.push({
      "name": "",
      "punkte": "",
      "studenten": [],
      "comment_privat": "",
      "comment_public": ""
    });
  }

  enableGroups(): void { }
}
