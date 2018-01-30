import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import electron from 'electron';

declare var require: any;
declare var $: any

var chartJs = require('chart.js');
const {remote} = electron;

@Component({
  selector: 'app-course-correction',
  templateUrl: './correction.component.html',
  styleUrls: ['./correction.component.scss']
})
export class CorrectionComponent implements OnInit {
  @ViewChild("graphCanvas") graphCanvas: ElementRef;

  private current_project: any;
  private current_task: any;
  private tasks: Array<any>;
  private participants: Array<any>;
  private correctionMode: boolean;
  private old_window_state;
  
  constructor(public dataService: GlobalDataService) { 
    
  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {      
      this.current_project = current_project;
      this.tasks = this.current_project.bewertungsschema.aufgaben;
      this.current_task = this.tasks[0];
      //this.current_task = this.tasks[0];
      //console.log(this.current_task.beschreibung);      
    });
  }

  setCorrectionMode():void {    
    this.correctionMode = !this.correctionMode;
    let win = remote.getCurrentWindow();    

    if(this.correctionMode){
      this.old_window_state = win.getBounds();
      win.setBounds({x: 240, y: 192, width: 440, height: 600});
    }
    else{
      win.setBounds(this.old_window_state);
    }
  }
}
