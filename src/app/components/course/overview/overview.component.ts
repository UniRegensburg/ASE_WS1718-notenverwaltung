import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';


declare var require: any;
declare var $: any

var chartJs = require('chart.js');

@Component({
  selector: 'app-course-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  @ViewChild("graphCanvas") graphCanvas: ElementRef;

  private current_project: any;
  private current_project_name: String;
  private grading: any;
  private participants: Array<any>;
  private display_user_list: boolean = false;
  private user_grading_list: any;
  
  private myChart: any;

  constructor(public dataService: GlobalDataService) { 
    
  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {      
      this.current_project = current_project;
      this.participants = this.current_project.teilnehmer;
      this.current_project_name = this.current_project.title;

      this.dataService.getStudentGrading().subscribe(data => {
        this.participants = data;        
        this.createUserGradingList();
        this.initGraphView();
      });
    });    
  }

  initGraphView(): void{
    if (this.myChart) {
      this.myChart.destroy();
    }

    let context: CanvasRenderingContext2D = this.graphCanvas.nativeElement.getContext("2d");

    this.myChart = new chartJs(context, {
      type: 'bar',
      data: {
        labels: ["1,0", "1,3", "1,5", "1,7", "1,9", "2,0", "2,3", "2,7", "3,0", "3,5", "4,0", "5,0"],
        datasets: [{
          data: [2, 3, 5, 4, 7, 4, 2, 1, 0, 6, 11, 12],
          responsive: true,
          backgroundColor: [
            'rgba(194, 24, 91, 1)',
            'rgba(194, 24, 91, 1)',
            'rgba(194, 24, 91, 1)',
            'rgba(194, 24, 91, 1)',
            'rgba(194, 24, 91, 1)',
            'rgba(194, 24, 91, 1)',
            'rgba(194, 24, 91, 1)',
            'rgba(194, 24, 91, 1)',
            'rgba(194, 24, 91, 1)',   
            'rgba(194, 24, 91, 1)',   
            'rgba(194, 24, 91, 1)',               
            'rgba(194, 24, 91, 1)',   
          ],
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        legend: {
          display: false
        }
      }
    });
  }

  createUserGradingList(): void{    
    this.current_project.teilnehmer.forEach(element => {
    });
  }

  getCorrectionCompletion(){
    let all_tasks_number = this.current_project.bewertungsschema.aufgaben.length;

    this.participants.forEach(student => {
      let completion_value: number = 0;
      let graded_student = this.getCurrentStudent(student.id);
      let completion_done = graded_student.einzelwertungen.length;
      completion_value = (all_tasks_number / completion_done) *100;
      student.completionRate = completion_value + "%";      
    });
  }

  getCurrentStudent(id): any{    
    this.current_project.bewertung.forEach(element => {     
      if(element.student_id == id) return element;
    }); 
  }
}
