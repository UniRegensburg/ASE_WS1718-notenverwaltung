import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;

  constructor() { }

  ngOnInit() {
  }

}
