import { Component, OnInit , ChangeDetectorRef, ChangeDetectionStrategy, NgZone, AfterContentChecked, AfterViewInit} from '@angular/core';
import { GlobalDataService } from '../../../providers/index';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { log } from 'util';

declare var require: any;
const app = require('electron').remote;
const dialog = app.dialog;
const fs = require('fs');

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GradingComponent implements OnInit, AfterViewInit {
  private current_project: any;
  private schemePoints = true;
  private schemePercentage = false;
  private tasks: Array < any > ;
  private grades: Array < any > ;
  private openCollapsible: any = {};
  private no_data_available: boolean = true;
  private max_points: number = 0;

  constructor(
    private dataService: GlobalDataService,
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone) {
  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project =>{
      this.current_project = current_project;
      this.changeDetectorRef.detectChanges();
      if (Object.keys(this.current_project.bewertungsschema).length == 0 || this.current_project == undefined) {
          this.no_data_available = true;
          this.changeDetectorRef.detectChanges();
      }
      else{
        this.no_data_available = false;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngAfterViewInit() {
    console.log("AFTER VIEW");
    this.calculateMaxPoints();
    this.changeDetected(null);
  }

  addNewTask(): void {
    this.current_project.bewertungsschema.aufgaben.push({
      'id': this.current_project.bewertungsschema.aufgaben.length,
      'position': this.current_project.bewertungsschema.aufgaben.length,
      'name': 'Aufgabe',
      'gewichtung': 100,
      'max_punkt': 10,
      'comment_public': true,
      'comment_privat': true,
      'beschreibung': '',
      'bewertungs_hinweis': ''
    });
    this.onKeyUp(null);
  }

  addNewGrade(): void {
    this.grades = this.current_project.bewertungsschema.allgemeine_infos.notenschluessel;
    this.current_project.bewertungsschema.allgemeine_infos.notenschluessel.push({
      'note': 5.0,
      'wert_min': 0
    });
  }

  changeDetected(event): void {
    this.dataService.setNewGrading(this.current_project.bewertungsschema);
    this.changeDetectorRef.detectChanges();
  }

  importScheme(): void {
      dialog.showOpenDialog((fileNames) =>{
        if (fileNames === undefined) {
          console.log('No file selected')
          return;
        }
        this.dataService.processImport(fileNames[0]).subscribe(data => {
          this.recallDataService();
        });
      });
  }

  createScheme(): void {
    this.dataService.createSchema().subscribe(current_project => {
      this.recallDataService();
    });
  }

  recallDataService(): void{
    this.no_data_available = false;
    this.zone.run(()=>{
      this.ngOnInit();
    });
  }

  pointsSelected(): void {
    this.schemePoints = true;
    this.schemePercentage = false;
    this.current_project.bewertungsschema.allgemeine_infos.bewertungseinheit = 'Punkte';
  }

  percentageSelected(): void{
    this.schemePoints = false;
    this.schemePercentage = true;
    this.current_project.bewertungsschema.allgemeine_infos.bewertungseinheit = 'Prozent';
  }

  deleteGrade(gradeID) {
    this.grades = this.current_project.bewertungsschema.allgemeine_infos.notenschluessel;
    this.grades.splice(gradeID,1);
  }

  deleteTask(taskID) {
    this.tasks = this.current_project.bewertungsschema.aufgaben;
    this.tasks.splice(taskID,1);
    this.onKeyUp(null);
  }

  onKeyUp(event):void{
      this.dataService.setNewGrading(this.current_project.bewertungsschema);
      this.calculateMaxPoints();
  }

  calculateMaxPoints(): void{
    this.max_points = 0;
    for (let entry in this.current_project.bewertungsschema.aufgaben){
      this.max_points += this.current_project.bewertungsschema.aufgaben[entry].max_punkt;
    }
  }

  privateCommentClicked(privateBool, taskIDprivate): void{
    this.current_project.bewertungsschema.aufgaben[taskIDprivate].comment_privat = privateBool;
    console.log(taskIDprivate, privateBool);
  }

  publicCommentClicked(publicBool, taskIDpublic): void{
    this.current_project.bewertungsschema.aufgaben[taskIDpublic].comment_public = publicBool;
    console.log(taskIDpublic, publicBool)
  }
}


