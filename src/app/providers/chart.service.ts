import { Injectable } from '@angular/core'
var chartJs = require('chart.js');

@Injectable()
export class ChartService {
    
    private barChart: any;
    private polarChart: any;
    private scatterChart: any;
    
    constructor() {}

  initGradeChart(grade_steps, grade_participants, context): void {    
    this.barChart = new chartJs(context, {
      type: 'bar',
      data: {
        labels: grade_steps,
        datasets: [
          {
            backgroundColor: ["#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60", "#c2185b", "#ad1457", "#880e4f", "#d81b60"],
            data: grade_participants
          }
        ]
      },
      options: {
        legend: { display: false },
        title: {
          display: false
        },
        scales: {
          yAxes: [{
              display: true,
              labelString: 'Month',
              ticks: {
                  beginAtZero: true,   // minimum value will be 0.
                  stepSize: 5,
              }
          }]
      }
      }
    });
  }

  initTaskChart(task_steps, task_dataset, context): void {    
    this.barChart = new chartJs(context, {
      type: 'bar',
      data: {
        labels: task_steps,
        datasets: task_dataset
      },
      options: {
        legend: { display: false },
        title: {
          display: false
        },
        scales: {
          yAxes: [{
              display: true,
              labelString: 'Month',
              ticks: {
                  beginAtZero: true,   // minimum value will be 0.
                  stepSize: 5,
              }
          }]
      }
      }
    });
  }

  
}