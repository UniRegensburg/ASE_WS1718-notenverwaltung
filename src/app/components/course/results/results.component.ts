import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;

  constructor() { }

  ngOnInit() {
  }

}
