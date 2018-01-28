import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;

  constructor() { }

  ngOnInit() {
  }
  // function openDialog(){
    // console.log("yo")
  // }
  openDialog(): void{
    console.log("Yo")
    var app = require('electron').remote;
    var dialog = app.dialog
    var fs = require('fs')
    dialog.showOpenDialog((fileNames) =>{
      if (fileNames === undefined){
        console.log("No file selected")
        return;
      }

      // console.log(fileNames)

      fs.readFile(fileNames[0], 'utf-8', (err, data) => {
        if(err){
          alert("An error ocurred reading the file: "+err.message);
          return;
        }
        this.processData(data)
        // console.log("The file content is:"+data);
      })
    });
    }
    processData(data): void{
      console.log("DATA:"+data)

    }



}
