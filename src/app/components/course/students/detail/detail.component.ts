import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { GlobalDataService, ChartService } from '../../../../providers/index'
import {
  ActivatedRoute, Router
} from '@angular/router';

import * as hopscotch from 'hopscotch';
import { log } from 'util';

declare var require: any;
declare var $: any;

@Component({
  selector: 'app-students-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  @ViewChild("taskChart") taskChart: ElementRef;

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

  @ViewChild('detailsView') detailsView: ElementRef;
  @ViewChild('saveDelete') saveDelete: ElementRef;
  @ViewChild('cancelButton') cancelButton: ElementRef;

  doTour() {      
    var tour = {
      id: "results-tutorial",
      steps: [
        {
          title: "Detailansicht",
          content: "Hier haben Sie die Möglichkeit die Details eines Studenten zu bearbeiten.",
          target: this.detailsView.nativeElement,
          placement: "left"
        },
        {
          title: "Speichern und Löschen",
          content: "Eventuelle Änderungen können Sie hier speichern. Ebenso besteht die Möglichkeit einen Studenten komplett zu löschen.",
          target: this.saveDelete.nativeElement,
          placement: "bottom"
        },
        {
          title: "Abbrechen",
          content: "Ein Klick auf Abbrechen bringt Sie zur Teilnehmerübersicht.",
          target: this.cancelButton.nativeElement,
          placement: "bottom"
        },
      ]
    };

    hopscotch.startTour(tour);

  }

  constructor(
    public dataService: GlobalDataService,
    private route: ActivatedRoute,
    public router: Router,
    public chartService: ChartService, 
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
      this.sub = this.route.params.subscribe(params => {
        this.dataService.getCurrentProject().subscribe(current_project => {          
          this.participants = current_project["teilnehmer"];
          if (params) {
            if(params.student_id == "createNewStudent"){
              this.getNewStudent();
              this.create_new_student_mode = true;
            }
            else{
              this.setCurrentStudent(params.student_id);
            }
          }
          this.initGraphView();
        });
      });
  }

  setCurrentStudent(id): void{
    this.participants.forEach(student => {
      if(student.id == id){
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

  saveStudent():void{
    this.dataService.setNewStudentsComplete(this.participants)
    this.router.navigate(['/course/students']);
  }

  getNewStudent(): void{
    this.dataService.createNewStudent().subscribe(student => {
      this.current_student = student;
    });
  }

  addStudent(): void{
    this.dataService.setNewStudents(this.current_student);
    this.router.navigate(['/course/students']);
  }

  deleteStudent(): void{
    this.participants.splice(this.current_student_index, 1);
    this.dataService.setNewStudents(this.participants);
    this.router.navigate(['/course/students']);
  }

}
