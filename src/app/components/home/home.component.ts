import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;

  constructor() { }

  ngOnInit() {
  }

}
