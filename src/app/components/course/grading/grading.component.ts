import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;
  
  private current_project: any;
  
  schemePoints = true;
  schemePercentage = false;

maxPoints=0;

  openCollapsible: any = {};
  
  constructor(public dataService: GlobalDataService) {
    
  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(data =>{
    this.current_project = data;
   });
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

  pointsSelected(): void{
    this.schemePoints = true;
    this.schemePercentage = false;
    this.current_project.bewertungsschema.allgemeine_infos.bewertungseinheit= "Punkte";
  }

  percentageSelected(): void{
    this.schemePoints = false;
    this.schemePercentage = true;
    this.current_project.bewertungsschema.allgemeine_infos.bewertungseinheit = "Prozent";
  }



}

