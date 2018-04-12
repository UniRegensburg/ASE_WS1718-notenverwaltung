import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalDataService, ChartService } from '../../../providers/index';
import { log } from 'util';

import * as hopscotch from 'hopscotch';


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
  private kurstitel: String;
  private grading: any;
  private participants: Array<any>;
  private no_data_available: boolean = true;
  private completion: number = 0;
  private sum_grade: number = 0;
  private barChart: any;


  @ViewChild('progressBar') progressBar: ElementRef;
  @ViewChild('studentTable') studentTable: ElementRef;


  doTour() {      
    var tour = {
      id: "overview-tutorial",
      steps: [
        {
          title: "Übersicht",
          content: "Dieser Bereich bietet Ihnen einen detaillierten Einblick in den aktuellen Kursstand. Hier sehen Sie Teilnehmeranzahl, Notendurchschnitt und den bisherigen Korrekturfortschritt.",
          target: this.progressBar.nativeElement,
          placement: "bottom"
        },
        {
          title: "Noten-Diagramm",
          content: "Ein Balkendiagramm zeigt Ihnen wie viele Studenten bisher welche Note erreicht haben.",
          target: this.graphCanvas.nativeElement,
          placement: "left"
        },
        {
          title: "Teilnehmerübersicht",
          content: "In dieser Tabelle erhalten Sie Details über alle Kursteilnehmer. Anhand der drei Symbole rechts können Sie die Korrektur bei einem bestimmten Studenten fortsetzen, erhalten vertiefte Details über den Studenten, oder gelangen zur Ergebnisübersicht.",
          target: this.studentTable.nativeElement,
          placement: "bottom"
        },
      ]
    };

    hopscotch.startTour(tour);

  }

  constructor(public dataService: GlobalDataService, public chartService: ChartService) { }


  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {
      this.current_project = current_project;
      this.kurstitel = this.current_project.title;

      try {
        this.participants = this.current_project.teilnehmer;
        if (this.participants.length == 0) {
          this.no_data_available = true;
        }
        else {
          this.no_data_available = false;
        }
      }
      catch (err) {
        this.participants.length = 0;
        this.no_data_available = true;
      }

      try {
        this.dataService.getStudentGrading().subscribe(data => {
          this.participants = data;
          this.completion = this.calcCompletion();
          this.sum_grade = this.calcSumGrade();
          this.createUserGradingList();
          this.initGraphView();
        });
      }
      catch (err) {
        console.log("no grading available")
      }

    });
  }

  calcCompletion(): number {
    let completion_val: number = 0;
    try {
      this.participants.forEach(student => {
        completion_val = completion_val + parseFloat(student.finish);
      });
      return parseFloat(((completion_val / this.participants.length) * 100).toFixed(2));
    }
    catch (err) {
      console.log("no completion rate available")
      return (0.0);
    }
  }

  calcSumGrade(): number {
    let sum_grade_val: number = 0;
    try {
      this.participants.forEach(student => {
        sum_grade_val = sum_grade_val + parseFloat(student.grade);
      });
      return parseFloat((sum_grade_val / this.participants.length).toFixed(2));
    } catch (err) {
      console.log("no grade available");
      return (0.0);
    }
  }

  initGraphView(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (!this.no_data_available) {
      let context: CanvasRenderingContext2D = this.graphCanvas.nativeElement.getContext("2d");
      let grade_steps = this.dataService.getGradingSteps();
      let grade_participants = this.dataService.getGradesPerStep(grade_steps.length);
      this.chartService.initGradeChart(grade_steps, grade_participants, context);
    }
  }

  createUserGradingList(): void {
    try {
      this.current_project.teilnehmer.forEach(element => {
      });
    } catch (err) {
      console.log("fail in createUserGradingList")
    }
  }

  getCorrectionCompletion() {
    try {
      let all_tasks_number = this.current_project.bewertungsschema.aufgaben.length;

      this.participants.forEach(student => {
        let completion_value: number = 0;
        let graded_student = this.getCurrentStudent(student.id);
        let completion_done = graded_student.einzelwertungen.length;
        completion_value = (all_tasks_number / completion_done) * 100;
        student.completionRate = completion_value + "%";
      });
    } catch (err) {
      console.log("fail in getCorrectionCompletion")
    }
  }

  getCurrentStudent(id): any {
    try {
      this.current_project.bewertung.forEach(element => {
        if (element.student_id == id) return element;
      });
    } catch (err) {
      console.log("fail in getCurrentStudent")
    }
  }

  
}
