import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';

import { GlobalDataService, LastOpened } from '../../providers/index';


declare var require: any;
declare var $: any;

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
    public lastOpened: LastOpened,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.last_files = this.lastOpened.getLastOpendFiles();
  }

  onChange(file) {

    this.dataService.getLocalFile(file).subscribe(
      data => {
          this.router.navigate(['course/overview']);
    });
  }
  openDialog(){
      var app = require('electron').remote;
      var dialog = app.dialog
      // var fs = require('fs')
      var self= this
      dialog.showOpenDialog((fileNames) =>{
        if (fileNames === undefined){
          console.log("No file selected")
          return;
        }
        // self.dataService.getLocalFile(fileNames[0]).subscribe(data =>{
        //     self.changeDetectorRef.detectChanges();
        //     self.router.navigate(['course/overview']);
        // });
      });
  }
}
