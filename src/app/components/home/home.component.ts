import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';

import { GlobalDataService, LastOpened } from '../../providers/index';

import * as hopscotch from 'hopscotch';

declare var require: any;
declare var $: any;





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

  @ViewChild('elementOneId') elementOne: ElementRef;
  @ViewChild('elementTwoId') elementTwo: ElementRef;

  doTour() {      
    var tour = {
      id: "hello-hopscotch",
      steps: [
        {
          title: "Step 1",
          content: "blah blah blah",
          target: this.elementOne.nativeElement,
          placement: "left"
        },
        {
          title: "Step 2",
          content: "I am the step for element 2...",
          target: this.elementTwo.nativeElement,
          placement: "bottom"
        },
      ]
    };

    hopscotch.startTour(tour);

  }

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
    

  }
}
