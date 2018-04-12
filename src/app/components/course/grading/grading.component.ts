import { Component, OnInit , ChangeDetectorRef, ChangeDetectionStrategy, NgZone, AfterContentChecked, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { GlobalDataService } from '../../../providers/index';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { log } from 'util';

import * as hopscotch from "hopscotch";

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


  @ViewChild('schemeHeader') schemeHeader: ElementRef;
  @ViewChild('gradingKey') gradingKey: ElementRef;
  @ViewChild('gradingUnit') gradingUnit: ElementRef;
  @ViewChild('stepButton') stepButton: ElementRef;
  @ViewChild('taskDetails') taskDetails: ElementRef;


  doTour() {      
    var tour = {
      id: "scheme-tutorial",
      steps: [
        {
          title: "Bewertungsschema",
          content: "Hier legen Sie fest welche Aufgaben und nach welchen Kriterien Sie bewerten möchten.",
          target: this.schemeHeader.nativeElement,
          placement: "bottom"
        },
        {
          title: "Notenschlüssel",
          content: "Um Ihren Notenschlüssel festzulegen können Sie jede Notenstufe samt Mindestwert bearbeiten und bei Bedarf anders anordnen oder löschen.",
          target: this.gradingKey.nativeElement,
          placement: "right"
        },
        {
          title: "Bewertungseinheit",
          content: "Je nach Präferenz können Sie dem Notenschlüssel Punkte oder Prozentzahlen als Einheit zu Grunde legen.",
          target: this.gradingUnit.nativeElement,
          placement: "left"
        },
        {
          title: "Notenstufen hinzufügen",
          content: "Sollten Sie weitere Notenstufen benötigen, so können Sie diese über diesen Button anfügen.",
          target: this.stepButton.nativeElement,
          placement: "bottom"
        },
        {
          title: "Aufgaben",
          content: "Aufgaben mitsamt allen wichtigen Details können Sie hier erstellen, hinzufügen, bearbeiten, in der Reihenfolge verändern oder löschen.",
          target: this.taskDetails.nativeElement,
          placement: "bottom"
        },
      ]
    };

    hopscotch.startTour(tour);

  }

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
    //console.log("AFTER VIEW");
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
    this.grades.splice(this.grades.length-1, 0, {
      'note': 4.9,
      'wert_min': 1
    } ); 
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

  logIndex(ind):void{
    //console.log("DAS IST COLLAPSIBLE:" + ind);
  }

  openCloseCollapsibles(indexColl):void{
   if (this.openCollapsible[indexColl] != "true"){
      this.openCollapsible={};
      this.openCollapsible[indexColl] = "true";
   } else{
    this.openCollapsible={};
   }
  }

  moveUpGrade(indexGrade){
    this.grades = this.current_project.bewertungsschema.allgemeine_infos.notenschluessel;
    this.grades.splice(indexGrade-1, 0, this.grades.splice(indexGrade, 1)[0]);
    this.onKeyUp(null);
  }

  moveDownGrade(indexGrade){
    this.grades = this.current_project.bewertungsschema.allgemeine_infos.notenschluessel;
    this.grades.splice(indexGrade+1, 0, this.grades.splice(indexGrade, 1)[0]);
    this.onKeyUp(null);
  }

  moveUpTask(indexTask){
    this.tasks = this.current_project.bewertungsschema.aufgaben;
    this.tasks.splice(indexTask-1, 0, this.tasks.splice(indexTask, 1)[0]);
    this.onKeyUp(null);
  }

  moveDownTask(indexTask){
    this.tasks = this.current_project.bewertungsschema.aufgaben;
    this.tasks.splice(indexTask+1, 0, this.tasks.splice(indexTask, 1)[0]);
    this.onKeyUp(null);
  }





}
 