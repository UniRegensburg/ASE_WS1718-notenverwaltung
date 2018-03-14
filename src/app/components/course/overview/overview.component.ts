import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalDataService, ChartService } from '../../../providers/index';
import { log } from 'util';


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
  private no_data_available: boolean = false;
  private completion: number = 0;
  private sum_grade: number = 0;
  private barChart: any;

  constructor(
    public dataService: GlobalDataService,
    public chartService: ChartService) {

  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {
      this.current_project = current_project;

      try {
        this.participants = this.current_project.teilnehmer;
      }
      catch (err) {
        this.participants.length = 0;
      }

      if (this.current_project.teilnehmer.length != 0) { //Observable catch?
        this.no_data_available = false;
        this.current_project_name = this.current_project.title;

        this.dataService.getStudentGrading().subscribe(data => {
          this.participants = data;
          this.completion = this.calcCompletion();
          this.sum_grade = this.calcSumGrade();
          this.createUserGradingList();
          this.initGraphView();
        });
      }
      else {
        this.no_data_available = true;
      }
    });
  }

  calcCompletion(): number {
    let completion_val: number = 0;
    this.participants.forEach(student => {
      completion_val = completion_val + parseFloat(student.finish);
    });
    return parseFloat(((completion_val / this.participants.length) * 100).toFixed(2));
  }

  calcSumGrade(): number {
    let sum_grade_val: number = 0;
    this.participants.forEach(student => {
      sum_grade_val = sum_grade_val + parseFloat(student.grade);
    });
    return parseFloat((sum_grade_val / this.participants.length).toFixed(2));
  }

  initGraphView(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }
    let context: CanvasRenderingContext2D = this.graphCanvas.nativeElement.getContext("2d");
    let grade_steps = this.dataService.getGradingSteps();
    let grade_participants = this.dataService.getGradesPerStep(grade_steps.length);
    this.chartService.initBarChart(grade_steps, grade_participants, context);
  }

  initBarChart(notenstufen, teilnehmernoten, context): void {
    this.barChart = new chartJs(context, {
      type: 'bar',
      data: {
        labels: notenstufen,
        datasets: [
          {
            backgroundColor: ["#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60"],
            data: teilnehmernoten
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: false,
          text: 'Notenspiegel'
        }
      }
    });
  }

  createUserGradingList(): void {
    this.current_project.teilnehmer.forEach(element => {
    });
  }

  getCorrectionCompletion() {
    let all_tasks_number = this.current_project.bewertungsschema.aufgaben.length;

    this.participants.forEach(student => {
      let completion_value: number = 0;
      let graded_student = this.getCurrentStudent(student.id);
      let completion_done = graded_student.einzelwertungen.length;
      completion_value = (all_tasks_number / completion_done) * 100;
      student.completionRate = completion_value + "%";
    });
  }

  getCurrentStudent(id): any {
    this.current_project.bewertung.forEach(element => {
      if (element.student_id == id) return element;
    });
  }
}
