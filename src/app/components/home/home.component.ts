import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';

import { GlobalDataService, LastOpened } from '../../providers/index';


declare var require: any;
declare var $: any;

var shepherd = require('shepherd.js');


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private title: string = `Notenverwaltung ASE WS17/18 !`;
  private last_files: Array<any> = [
  ];
  private view_mode: boolean = true;
  private tour;

  constructor(
    public dataService: GlobalDataService,
    public router: Router,
    public lastOpened: LastOpened,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.last_files = this.lastOpened.getLastOpendFiles();
    
    this.tour = new shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows',
        scrollTo: true
      }
    });

    this.tour.addStep('example-step', {
      text: 'This step is attached to the bottom of the <code>.example-css-selector</code> element.',
      attachTo: '.example-css-selector bottom',
      classes: 'example-step-extra-class',
      buttons: [
        {
          text: 'Next',
          action: this.tour.next
        }
      ]
    });
  }

  onChange(file) {
    this.dataService.getLocalFile(file['0'].path).subscribe(
      data => {
        if(this.dataService.checkJsonValidity() == 1){
            alert("file not recognized. please select a valid file.")
        }
        else{
            this.router.navigate(['course/overview']);
        }
      },
      err => {
        alert("File not recognized. Please select a valid file.")
      }
    );
  }
  openDialog() {
    var app = require('electron').remote;
    var dialog = app.dialog;

    dialog.showOpenDialog((fileNames) => {
      if (fileNames === undefined) {
        console.log("No file selected")
        return;
      }
      this.router.navigate(['course/overview']);

      this.dataService.getLocalFile(fileNames[0]).subscribe(data => {
        ///this.changeDetectorRef.detectChanges();
        this.router.navigate(['course/overview']);
      });
    });
  }

  startTutorial(){
    this.tour.start();
  }
}
