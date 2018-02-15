import { Component, OnInit } from '@angular/core';
import { GlobalDataService, ChartService, gripsExportService, lsfExportService } from '../../../providers/index';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;

  private current_project: any;
  private current_project_name: String;
  private participants: Array<any>;

  private notenstufen: any;
  private teilnehmernoten: any;

  private display_diagrams: boolean = true;

  constructor(public dataService: GlobalDataService, public chartService: ChartService, public grips: gripsExportService, public lsf: lsfExportService) { }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(current_project => {
      this.current_project = current_project;
      this.participants = this.current_project.teilnehmer;
      this.initGraphView();
    });
  }

  createUserGradingList(): void {
    this.current_project.teilnehmer.forEach(element => {
    });
  }

  condition(): any {
    this.display_diagrams = !this.display_diagrams;
  }

  initGraphView(): void {
    this.getDiagramData();

    this.chartService.initBarChart(this.notenstufen, this.teilnehmernoten);
    this.chartService.initPolarChart();
    this.chartService.initScatterChart();
  }

getDiagramData(): void {
  this.notenstufen = this.dataService.getGradingSteps();
  this.teilnehmernoten = this.dataService.getGradesPerStep(this.notenstufen.length)
}

  export(string): void {
    switch (string) {
      case "lsf":
        this.lsf.export()
        break;
      case "grips":
        this.grips.export()
        break;
    }
  }

}
