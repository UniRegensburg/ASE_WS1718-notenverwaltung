import { Component, OnInit } from '@angular/core';
import { GlobalDataService, gripsExportService, lsfExportService } from '../../../providers/index';



declare var $: any

var chartJs = require('chart.js');


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
  private display_user_list: boolean = false;
  private user_grading_list: any;

  private display_diagrams: boolean = true;

  private barChart: any;
  private polarChart: any;
  private scatterChart: any;

  constructor(public grips: gripsExportService, public lsf: lsfExportService) { }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(data => {
      this.current_project = data;
      console.log(this.current_project);
      this.initGraphView();
    });
  }

  initGraphView(): void {
    this.initBarChart();
    this.initPolarChart();
    this.initScatterChart();
  }

  condition(): any {
    console.log("look at me");
    this.display_diagrams = !this.display_diagrams;
  }

  initBarChart(): void {
    this.barChart = new chartJs(document.getElementById("bar-chart"), {
      type: 'bar',
      data: {
        labels: ["1.0", "1.3", "1.7", "2.0", "2.3", "2.7", "3.0", "3.3", "3.7", "4.0", "5.0"],
        datasets: [
          {
            //label: "Population (millions)",
            backgroundColor: ["#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60",],
            data: [1, 3, 7, 7, 2, 7, 3, 2, 1, 10, 4, 0]
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

  initPolarChart(): void {
    this.polarChart = new chartJs(document.getElementById("polar-chart"), {
      type: 'polarArea',
      data: {
        labels: ["StA1", "StA2", "StA3", "StA4", "Abschlussprojekt"],
        datasets: [
          {
            // label: "Population (millions)",
            backgroundColor: ["#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60",],
            data: [40, 90, 85, 60, 70]
          }
        ]
      },
      options: {
        title: {
          display: false,
          text: 'Predicted world population (millions) in 2050'
        }
      }
    });
  }

  initScatterChart(): void {
    this.scatterChart = new chartJs(document.getElementById("scatter-chart"), {
      type: 'bubble',

      data: {
        datasets: [{
          backgroundColor: ["#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60"],
          borderColor: "transparent",

          label: 'Anzahl Studierende',
          data: [{
            x: 0,
            y: 0
          }, {
            x: 1,
            y: 40,
            r: 10
          }, {
            x: 1,
            y: 80,
            r: 10
          }, {
            x: 1,
            y: 100,
            r: 1
          }, {
            x: 1,
            y: 70,
            r: 2
          }, {
            x: 1,
            y: 10,
            r: 4
          }, {
            x: 2,
            y: 60,
            r: 5
          }, {
            x: 2,
            y: 80,
            r: 7
          }, {
            x: 2,
            y: 90,
            r: 2
          }, {
            x: 2,
            y: 95,
            r: 10
          }, {
            x: 2,
            y: 70,
            r: 3
          }, {
            x: 2,
            y: 60,
            r: 7
          }, {
            x: 3,
            y: 50,
            r: 5
          }, {
            x: 4,
            y: 40,
            r: 10
          }, {
            x: 4,
            y: 80,
            r: 10
          }, {
            x: 5,
            y: 100,
            r: 1
          }, {
            x: 5,
            y: 70,
            r: 2
          }, {
            x: 5,
            y: 10,
            r: 4
          }, {
            x: 5,
            y: 60,
            r: 5
          }, {
            x: 4,
            y: 80,
            r: 7
          }, {
            x: 2,
            y: 90,
            r: 2
          }, {
            x: 2,
            y: 95,
            r: 10
          }, {
            x: 3,
            y: 70,
            r: 3
          }, {
            x: 3,
            y: 80,
            r: 2
          }]
        }]
      },
      options: {
        //TODO: make following work https://dima117.github.io/Chart.Scatter/
        scaleShowGridLines: false,
        xScaleOverride: true,
        title: {
          display: false,
          text: 'Predicted world population (millions) in 2050'
        },
      }
    });
  }

<<<<<<< HEAD
  export(string): void {
    this.exportService.export(string)
=======
  export(string):void{
      switch(string){
          case "lsf":
              this.lsf.export()
              break;
          case "grips":
              this.grips.export()
              break;
      }
>>>>>>> development
  }

}
