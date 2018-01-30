import { Component, OnInit } from '@angular/core';
import { GlobalDataService, ExportService } from '../../../providers/index';

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

  private barChart: any;

  constructor(public exportService: ExportService) { 

  }

  ngOnInit() {
    this.initGraphView();
  }

  initGraphView(): void{
    this.initBarChart();
  }

  initBarChart():void {

    this.barChart = new chartJs(document.getElementById("bar-chart"), {
      type: 'bar',
      data: {
        labels: ["1.0", "1.3", "1.7", "2.0", "2.3", "2.7", "3.0", "3.3", "3.7", "4.0", "5.0"],
        datasets: [
          {
            //label: "Population (millions)",
            backgroundColor: ["#c2185b", "#ad1457","#880e4f","#d81b60","#c2185b", "#ad1457","#880e4f","#d81b60","#c2185b", "#ad1457","#880e4f","#d81b60",],
            data: [1,3,7,7,2,7,3,2,1,10,4,0]
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

  export(string): void {
    this.exportService.export(string)
  }

}
