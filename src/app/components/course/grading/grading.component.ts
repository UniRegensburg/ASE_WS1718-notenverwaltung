import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { GlobalDataService } from '../../../providers/index';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;

  private current_project: any;

  schemeEditMode = false;
  openCollapsible: any = {};

  constructor(public dataService: GlobalDataService, private http: Http,  private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(data =>{
    this.current_project = data;
   });
  }

  setEditMode(new_status): void{
    this.schemeEditMode = new_status;
  }

  addNewTask(): void{
    this.current_project.bewertungsschema.aufgaben.push({
      "id": this.current_project.bewertungsschema.aufgaben.length,
      "position": this.current_project.bewertungsschema.aufgaben.length,
      "name": "Aufgabe " + (this.current_project.bewertungsschema.aufgaben.length + 1),
      "gewichtung": 1.0,
      "max_punkt": 0,
      "comment_public": true,
      "comment_privat": true,
      "beschreibung": "",
      "bewertungs_hinweis": ""
    });
  }
  changeDetected(event):void{
    this.dataService.setNewGrading(this.current_project.bewertungsschema);
  }
  importScheme(): void{
      var app = require('electron').remote;
      var dialog = app.dialog
      var fs = require('fs')
      dialog.showOpenDialog((fileNames) =>{
        if (fileNames === undefined){
          console.log("No file selected")
          return;
        }
        this.processImport(fileNames[0])
      });
  }
  processImport(file): void{
      console.log("opening",file)
      this.http.get(file).subscribe(res => {
                            this.current_project.bewertungsschema = res.json().bewertungsschema
                            this.changeDetectorRef.detectChanges();
                            })
   }
}
