import { Injectable } from '@angular/core'
var chartJs = require('chart.js');

@Injectable()
export class ChartService {
    
    private barChart: any;
    private polarChart: any;
    private scatterChart: any;
    
    constructor() {}

  initBarChart(note_gradually, note_participants, context): void {
    this.barChart = new chartJs(context, {
      type: 'bar',
      data: {
        labels: note_gradually,
        datasets: [
          {
            backgroundColor: ["#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60"],
            data: note_participants
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
            backgroundColor: ["#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60"],
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
}