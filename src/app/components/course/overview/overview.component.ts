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
  private display_user_list: boolean = false;
  private user_grading_list: any;
  private no_data_available: boolean = true;
  private completion: number = 0;
  private sum_grade: number = 0;
  private barChart: any;

  @ViewChild('elementOneId') elementOne: ElementRef;
  @ViewChild('elementTwoId') elementTwo: ElementRef;
  @ViewChild('elementThreeId') elementThree: ElementRef;
  @ViewChild('elementFourId') elementFour: ElementRef;
  @ViewChild('elementFiveId') elementFive: ElementRef;

  doTour() {      
    var tour = {
      id: "hello-hopscotch",
      steps: [
        {
          title: "Willkommen!",
          content: "In diesem Tutorial werden Ihnen die einzelnen Funktionen dieser Notenverwaltungs-Software präsentiert.",
          target: this.elementOne.nativeElement,
          placement: "bottom"
        },
        {
          title: "Auswählen und Erstellen von Dateien...",
          content: "Üblicherweise beginnen Sie ihre Arbeit indem Sie einen neuen Kurs erstellen oder auf eine bereits angelegte Datei zugreifen.",
          target: this.elementTwo.nativeElement,
          placement: "right"
        },
        {
          title: "Zuletzt verwendete Dateien...",
          content: "Die Ansicht der zuletzt geöffneten Dateien ermöglicht Ihnen Listen- oder Symboldarstellung.",
          target: this.elementThree.nativeElement,
          placement: "bottom"
        },
        {
          title: "Eine Datei auswählen...",
          content: "Klicken Sie nun auf Datei auswählen und öffnen Sie die Datei Example-Project.json.",
          target: this.elementFour.nativeElement,
          placement: "bottom",
          showNextButton:false,
          nextOnTargetClick:true,
          //showCTAButton: true,
          //ctaLabel: "Example öffnen",
          //onCTA: function() {
            //document.getElementById('file_selector').click();
          //}
        },
        {
          title: "Glückwunsch!",
          content: "Sie haben den ersten Teil des Tutorials abgeschlossen. Abhängig davon welchen Bereich der Software Sie gerade betrachten, können Sie sich bei Bedarf die zugehörigen Funktionen per Klick auf den Tutorial-Button erläutern lassen.",
          target: this.elementFive.nativeElement,
          placement: "left",
          yOffset: -130, 
          arrowOffset: 150,
        },
        
      ]
    };

    hopscotch.startTour(tour);

  }

  constructor(
    public dataService: GlobalDataService,
    public chartService: ChartService) {

  }

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

    if (this.no_data_available) {

    } else {
      let context: CanvasRenderingContext2D = this.graphCanvas.nativeElement.getContext("2d");
      let grade_steps = this.dataService.getGradingSteps();
      let grade_participants = this.dataService.getGradesPerStep(grade_steps.length);
      this.chartService.initBarChart(grade_steps, grade_participants, context);
    }
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
