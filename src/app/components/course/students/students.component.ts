import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import * as XLSX from 'ts-xlsx'
import { GlobalDataService } from '../../../providers/index'
import { ActivatedRoute, Router } from '@angular/router';
import { SearchStudentPipe } from '../../../pipes/index';
import { log } from 'util';
import { ToastService } from '../../../providers/toast.service';


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
      var student = {
        "id": 0,
        "mtknr": 0,
        "name": 0,
        "vorname": 0,
        "studiengang": 0,
        "fachsemester": 0,
        "mail": 0,
        "status": 0
      }
      // move through the cells, saving data accordingly
      for (var i = 0; i < 8; i++) {
        address = String.fromCharCode(65 + row + i) + cell;
        switch (i) {
          case 0:
            student.id = worksheet[address].v
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
      this.current_project.teilnehmer.forEach((existing_student)=>{
          if(existing_student.mtknr == student.mtknr){
              check = false
              // this.toastService.setError("Import des Studenten mit der Matrikelnummer "+student.mtknr+" fehlgeschlagen. Matrikelnummer ist bereits vergeben.")
          }
      });
      students.forEach((existing_student)=>{
          if(existing_student.mtknr == student.mtknr){
              check = false
              // this.toastService.setError("Import des Studenten mit der Matrikelnummer "+student.mtknr+" fehlgeschlagen. Matrikelnummer ist bereits vergeben.")
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
      this.toastService.success("Erfolgreicher Import von " + this.studentNumber + " neuen Studenten.");
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
    console.log("change detected");
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
