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
  
  schemeEditMode = false;
  openCollapsible: any = {};
  
  constructor(public dataService: GlobalDataService) {
    
  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(data =>{
    this.current_project = data;
    console.log(this.current_project.bewertungsschema.allgemeine_infos.notenschluessel[0].note);
   });
   console.log("hier");
  }
  
  

  
  setEditMode(new_status): void{
    this.schemeEditMode = new_status;
  //console.log(this.schemeEditMode);
  console.log("EDITIER MODUS KNOPF GEKLICKT");
  }

}
