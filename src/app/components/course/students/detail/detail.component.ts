import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GlobalDataService } from '../../../../providers/index'
import {
  ActivatedRoute
} from '@angular/router';

declare var require: any;
declare var $: any;

@Component({
  selector: 'app-students-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;
  private sub: any;
  private participants: any;
  private current_student: any;

  constructor(public dataService: GlobalDataService, private route: ActivatedRoute) { }

  ngOnInit() {   
      this.sub = this.route.params.subscribe(params => {
        this.dataService.getCurrentProject().subscribe(current_project => {
          this.participants = current_project["teilnehmer"];          
          if (params) {            
            if(params.student_id == "createNewStudent"){              
              this.getNewStudent();
            }
            else{
              this.setCurrentStudent(params.student_id);
            }
          } 
        });       
      });
  }

  setCurrentStudent(id): void{
    this.participants.forEach(student => {
      if(student.id == id){
        this.current_student = student;                                
      }
    }); 
  }

  getNewStudent(): void{
    this.dataService.createNewStudent().subscribe(data => {
      this.participants = data.current_project["teilnehmer"];
      this.setCurrentStudent(data.id);
    });
    
  }

}
