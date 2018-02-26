import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnInit {
  private current_project: any; 
  private schemePoints = true;
  private schemePercentage = false;
  private maxPoints=0;
  private openCollapsible: any = {};
  private no_data_available: boolean = false;
  
  constructor(public dataService: GlobalDataService) {
    
  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project =>{
      this.current_project = current_project;
      if (this.current_project != null) {
        this.no_data_available = false;
      }
      else{
        this.no_data_available = true;
      }
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

  addNewGrade(): void{
    this.current_project.bewertungsschema.allgemeine_infos.notenschluessel.push({
      "note": 6.6,
      "wert_min": 10
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

  deleteEntry(){
    console.log("phew phew");
  }


}

