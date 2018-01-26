import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;
schemeCreateMode = false;
  schemeEdit = false;

  
  constructor() { }

  ngOnInit() {
  
  //const json = require("../../../assets/data/schema_basic.json");
  
  //console.log(json);
  console.log(this.schemeCreateMode);
  
  
  }
  setCreateMode(new_status): void{
  this.schemeCreateMode = new_status;
  console.log(this.schemeCreateMode);
  }

}
