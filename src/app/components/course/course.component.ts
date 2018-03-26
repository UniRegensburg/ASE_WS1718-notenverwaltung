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

  mouseEnter(div : any){
    console.log("hier", div.srcElement);
    div.srcElement.style.width = "250px";
    div.srcElement.style.backgroundColor = "#C2185B";
  }

  mouseLeave(div : any){
    console.log("hier", div.srcElement);
    div.srcElement.style.width = "68px";
    div.srcElement.style.backgroundColor = null;
  }

}
