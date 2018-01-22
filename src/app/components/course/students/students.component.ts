import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;

  constructor() { }

  ngOnInit() {
  }

}
