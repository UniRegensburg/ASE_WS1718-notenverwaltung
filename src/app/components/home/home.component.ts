import { Component, OnInit } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';

import { GlobalDataService, LastOpened } from '../../providers/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private title:string = `Notenverwaltung ASE WS17/18 !`;
  private last_files: Array<any> = [
  ];
  private view_mode: boolean = true;

  constructor(
    public dataService: GlobalDataService,
    public router: Router,
    public lastOpened: LastOpened
  ) { }

  ngOnInit() {
    this.lastOpened.getLastOpendFiles().subscribe(
      data=>{
      console.log(data);
    },
    error => {
      console.log(error);
      
    });
  }

  onChange(file) {   
    this.dataService.getLocalFile(file["0"].path).subscribe(
      data => {
          console.log("1:", data);      
          this.router.navigate(['course/1']);    
    });
  }
}
