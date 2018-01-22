import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;
  collpase = true;

  constructor() { }

  ngOnInit() {
  }

  setCollpased(new_status): void{
    this.collpase = new_status;     
  }

}
