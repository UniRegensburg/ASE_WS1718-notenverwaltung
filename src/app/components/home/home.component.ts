import { Component, OnInit } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';

import { GlobalDataService } from '../../providers/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private title:string = `Notenverwaltung ASE WS17/18 !`;
  private last_files: Array<any> = [
        {
          "id" : 0,
          "file_name" : "DH_WS_17_18.nvwt",
          "last_opened" : "07.01.2018",
          "title" : "Digital Humanities WS 2017/2018"
        },
        {
          "id" : 1,
          "file_name" : "ASE_SS.nvwt",
          "last_opened" : "07.01.2018",
          "title" : "Digital Humanities WS 2017/2018"
        }
  ];
  private view_mode: boolean = true;

  constructor(
    public dataService: GlobalDataService,
    public router: Router
  ) { }

  ngOnInit() {
  }

  onChange(file) {   
    this.dataService.getLocalFile(file["0"].path).subscribe(
      data => {
          console.log("1:", data);      
          this.router.navigate(['course/1']);    
    });
  }
}
