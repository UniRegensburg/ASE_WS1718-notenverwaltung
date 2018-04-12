import { Component, OnInit } from '@angular/core';
import { lastSavedService } from '../../providers/index';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;
  collpase = true;
    private lastSaved: any;

  constructor(private saveService: lastSavedService) { }

  ngOnInit() {
      this.lastSaved = "vor weniger als 30 Sekunden"
      setInterval(()=>{
          let date = this.saveService.getTime()
          let d = new Date()
          let r_n = d.getTime();
          let time = (r_n - date.getTime())/1000
         if(time < 30){
             this.lastSaved = "vor weniger als 30 Sekunden"
         }
         else if(time < 60){
             this.lastSaved = "vor weniger als einer Minute"
         }
         else if(time < 120){
             this.lastSaved = "vor einer Minute"
         }
         else if(time > 120){
             this.lastSaved = "vor "+Math.round(time/60) as string+" Minuten"
         }
     },1000);
  }

  setCollpased(new_status): void{
    this.collpase = new_status;
  }

  mouseEnter(div : any){
    div.srcElement.style.width = "250px";
    div.srcElement.style.backgroundColor = "#C2185B";
  }

  mouseLeave(div : any){
    div.srcElement.style.width = "68px";
    div.srcElement.style.backgroundColor = null;
  }

}
