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
            this.participants.forEach(student => {
              if(student.id == params.student_id){
                this.current_student = student;                                
              }
            }); 
          } 
        });       
      });
  }

}
