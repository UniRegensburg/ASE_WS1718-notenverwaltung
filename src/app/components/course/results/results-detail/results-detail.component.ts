import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { GlobalDataService, ChartService, ToastService } from '../../../../providers/index'
import {
  ActivatedRoute, Router
} from '@angular/router';

import * as hopscotch from 'hopscotch';
import { log } from 'util';

declare var require: any;
declare var $: any;

@Component({
  selector: 'app-students-result-detail',
  templateUrl: './results-detail.component.html',
  styleUrls: ['./results-detail.component.scss']
})
export class ResultsDetailComponent implements OnInit {
  @ViewChild("taskChart") taskChart: ElementRef;

  private current_project: any;
  
  private sub: any;
  private participants: any;
  private current_student: any;
  private current_student_index: number;
  private create_new_student_mode: boolean = false;

  public completion: number;
  public grade: number;
  public total_points: number;

  private task_steps: any;
  private task_dataset: any;

  public grading_list: any;


  @ViewChild('staticInfo') staticInfo: ElementRef;
  @ViewChild('graphView') graphView: ElementRef;


  doTour() {
    var tour = {
      id: "details-results-tutorial",
      steps: [
        {
          title: "Nutzer Eckdaten",
          content: "Hier haben Sie die Möglichkeit zu sehen, welche Note der Student bekommt, wie viele Prozent Sie schon bewertet haben bzw. was die aktuelle Gesamtpunktzahl des Studenten ist.",
          target: this.staticInfo.nativeElement,
          placement: "left"
        },
        {
          title: "Speichern und Löschen",
          content: "Eventuelle Änderungen können Sie hier speichern. Ebenso besteht die Möglichkeit einen Studenten komplett zu löschen.",
          target: this.graphView.nativeElement,
          placement: "bottom"
        }       
      ]
    };

    hopscotch.startTour(tour);

  }

  constructor(
    public dataService: GlobalDataService,
    private route: ActivatedRoute,
    public router: Router,
    public chartService: ChartService, 
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
        this.dataService.getCurrentProject().subscribe(current_project => {          
          this.participants = current_project["teilnehmer"];
          this.current_project = current_project;
          this.grading_list = this.current_project.bewertungsschema.allgemeine_infos.notenschluessel;    
          if (params) {
            this.setCurrentStudent(params.student_id);
          }
          this.initGraphView();
        });
    });
  }

  setCurrentStudent(id): void {
    this.participants.forEach(student => {
      if (student.id == id) {
        this.current_student = student;
        this.current_student_index = id;
      }
    });
  }

  initGraphView(): void {
    this.getDiagramData();
    this.getStudentData();

    let contextTaskChart: CanvasRenderingContext2D = this.taskChart.nativeElement.getContext("2d");
    this.chartService.initTaskChart(this.task_steps, this.task_dataset, contextTaskChart);
  }

  getDiagramData(): void {
    this.task_steps = this.dataService.getTaskSteps(); 
    this.task_dataset = this.dataService.getTaskDataset(true, this.current_student.id);
  }

  getStudentData(): void {    
    this.completion = parseFloat(this.current_student.finish) * 100;
    this.grade = this.current_student.grade;
    this.total_points = this.dataService.getStudentTotalPoints(this.current_student.id);
  }

  checkColorGrading() {

    if(this.grading_list == undefined){
      this.grading_list = this.current_project.bewertungsschema.allgemeine_infos.notenschluessel;     
    }
    
    if(this.grading_list.length > 2){
      if(this.grade == this.grading_list[this.grading_list.length-2].note){
        return ("background-color: #ff9800 !important");
      }
      if(this.grade == this.grading_list[this.grading_list.length-1].note){
        return ("background-color: #f44336 !important");
      }
   }
  }
}
