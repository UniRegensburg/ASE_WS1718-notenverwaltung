import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GlobalDataService } from '../../../../providers/index'
import {
  ActivatedRoute, Router
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
  private current_student_index: number;
  private create_new_student_mode: boolean = false;

  constructor(
    public dataService: GlobalDataService, 
    private route: ActivatedRoute,
    public router: Router) { }

  ngOnInit() {   
      this.sub = this.route.params.subscribe(params => {
        this.dataService.getCurrentProject().subscribe(current_project => {
          this.participants = current_project["teilnehmer"];          
          if (params) {            
            if(params.student_id == "createNewStudent"){              
              this.getNewStudent();
              this.create_new_student_mode = true;
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
        this.current_student_index = id;                              
      }
    }); 
  }

  getNewStudent(): void{
    this.dataService.createNewStudent().subscribe(student => {
      this.current_student = student;
    });
  }

  addStudent(): void{
    this.dataService.setNewStudents(this.current_student);
    this.router.navigate(['/course/students']);
  }

  deleteStudent(): void{
    this.participants.splice(this.current_student_index, 1);    
    this.dataService.setNewStudents(this.participants);
    this.router.navigate(['/course/students']);
  }

}
