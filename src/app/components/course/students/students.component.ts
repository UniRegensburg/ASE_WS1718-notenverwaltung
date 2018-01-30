import { Component, OnInit } from '@angular/core';
import * as XLSX from 'ts-xlsx'
import { GlobalDataService } from '../../../providers/index'

declare var require: any;
declare var $: any;

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;
  private current_project: any;
  private current_project_name: String;
  private participants: Array<any>;

  constructor(public dataService: GlobalDataService) { }

  ngOnInit() {
      this.dataService.getCurrentProject().subscribe(current_project => {
         this.current_project = current_project;
         this.participants = this.current_project.participants;
         this.dataService.getCurrentProjectName().subscribe(current_project_name =>{
             this.current_project_name = current_project_name;
         })
         this.dataService.getParticipants().subscribe(teilnehmer =>{
            this.participants = teilnehmer;
        });
      });
  }

  openDialog(): void{
    var app = require('electron').remote;
    var dialog = app.dialog
    var fs = require('fs')
    dialog.showOpenDialog((fileNames) =>{
      if (fileNames === undefined){
        console.log("No file selected")
        return;
      }
      this.processData(fileNames[0])
    });
    }

    processData(filepath): void{
      // Get the correct sheet
      var workbook = XLSX.readFile(filepath)
      var sheetname = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[sheetname];

      // Check where the table starts
      var row = 0
      var cell = 1
      var address = String.fromCharCode(65+row)+cell
      while(worksheet[address].v !="Nr"){
        cell+=1
        if(cell=== 20){
          cell = 1
          row+=1
        }
        address= String.fromCharCode(65+row)+cell;
      }
      // Move to the first row
      cell+=1
      address=String.fromCharCode(65+row)+cell;
      // as long as there are numbers (= students)
      var students = []
      while(worksheet[address].v !==""){
        var student = {
            "id" : 0,
            "mtknr" : 0,
            "name" : 0,
            "vorname" : 0,
            "studiengang" : 0,
            "fachsemester" : 0,
            "mail" : 0,
            "status" : 0
        }
        // move through the cells, saving data accordingly
        for(var i=0;i<8;i++){
          address= String.fromCharCode(65+row+i)+cell;
          switch(i){
            case 0:
              student.id = worksheet[address].v
              break;
            case 1:
              student.mtknr = worksheet[address].v
              break;
            case 2:
              student.name  = worksheet[address].v
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
        students.push(student)
        cell+=1
        address= String.fromCharCode(65+row)+cell;
        this.dataService.setNewStudents(student);
      }
      console.log(students)
      console.log("paricipants:",this.participants)
      
    }



}
