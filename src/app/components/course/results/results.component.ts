import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalDataService, ChartService, gripsExportService, flexNowExportService } from '../../../providers/index';
import {SearchStudentPipe} from '../../../pipes/index';

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

  private grade_steps: any;
  private grade_participants: any;

  private display_diagrams: boolean = true;

  public searchValue: string;

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

}
