import { Component, OnInit } from '@angular/core';
import { GlobalDataService, ExportService } from '../../../providers/index';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;

  constructor(public exportService: ExportService) { }

  ngOnInit() {

  }

  export(string): void {
    this.exportService.export(string)
  }

}
