import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalDataService, ChartService, gripsExportService, flexNowExportService } from '../../../providers/index';
import {SearchStudentPipe} from '../../../pipes/index';
import { log } from 'util';

import * as hopscotch from 'hopscotch';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  @ViewChild("barchart") graphCanvas: ElementRef;

  private current_project: any;
  private current_project_name: String;
  private participants: Array<any>;
  private tasks: Array<any>;
  private results: Array<any>;

  private grade_steps: any;
  private grade_participants: any;
  public grading_list: any;

  private display_diagrams: boolean = true;

  public searchValue: string;

  @ViewChild('resultsTable') resultsTable: ElementRef;
  @ViewChild('searchBar') searchBar: ElementRef;
  @ViewChild('graphButton') graphButton: ElementRef;
  @ViewChild('exportButton') exportButton: ElementRef;


  doTour() {      
    var tour = {
      id: "results-tutorial",
      steps: [
        {
          title: "Ergebnisse",
          content: "Die nebenstehende Tabelle zeigt die Ergebnisse der einzelnen Teilnehmer auf. Hierbei werden Studenten der Bestehen gefährdet ist farblich abgehoben.",
          target: this.resultsTable.nativeElement,
          placement: "left"
        },
        {
          title: "Suchleiste",
          content: "Per Suchleiste kann die Tabelle gezielt nach bestimmten Teilnehmern gefiltert werden.",
          target: this.searchBar.nativeElement,
          placement: "bottom"
        },
        {
          title: "Diagramm-Schalter",
          content: "Zusätzliche Ergebnisinformationen in Diagrammform sind standardmäßig ausgeblendet und können hier zugeschalten werden.",
          target: this.graphButton.nativeElement,
          placement: "bottom"
        },
        {
          title: "Exportfunktionen",
          content: "Kursergebnisse können zur einfacheren Weiterverwendung in speziellen Formaten für Flexnow und Grips exportiert, oder als PDF Datei aufbereitet werden.",
          target: this.exportButton.nativeElement,
          placement: "bottom"
        },
      ]
    };

    hopscotch.startTour(tour);

  }

  constructor(
    public dataService: GlobalDataService, 
    public chartService: ChartService, 
    public grips: gripsExportService, 
    private searchStudentPipe: SearchStudentPipe,
    public flexnow: flexNowExportService) { }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {
      this.current_project = current_project;
      this.participants = this.current_project.teilnehmer;
      this.tasks = this.current_project.bewertungsschema.aufgaben;
      this.results = this.current_project.bewertung;
      this.grading_list = this.current_project.bewertungsschema.allgemeine_infos.notenschluessel;      
      this.initGraphView();
    });
  }

  switch_diagrams(): any {
    this.display_diagrams = !this.display_diagrams;
  }

  initGraphView(): void {
    this.getDiagramData();
    let context: CanvasRenderingContext2D = this.graphCanvas.nativeElement.getContext("2d");
    this.chartService.initBarChart(this.grade_steps, this.grade_participants, context);
    //this.chartService.initPolarChart();
    //this.chartService.initScatterChart();
  }

  getDiagramData(): void {
    this.grade_steps = this.dataService.getGradingSteps();
    this.grade_participants = this.dataService.getGradesPerStep(this.grade_steps.length);
  }

  export(string): void {
    switch (string) {
      case "flexnow":
        this.flexnow.export()
        break;
      case "grips":
        this.grips.export()
        break;
      case "print":
        window.print();
        break;
    }
  }

  checkColorGrading(div, grade) {   
    var element = document.getElementById(div);
    
    if(element != null){
      if(this.grading_list.length > 2){        
        if(grade == this.grading_list[this.grading_list.length-2].note){
          element.style.backgroundColor = "#ff9800"; 
          element.style.color = "white";   
        }
        if(grade == this.grading_list[this.grading_list.length-1].note){
          element.style.backgroundColor = "#f44336";   
          element.style.color = "white"; 
        }
      }    
   }
  }

}
