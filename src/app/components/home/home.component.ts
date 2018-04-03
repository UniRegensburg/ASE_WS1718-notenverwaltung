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
  @ViewChild('elementThreeId') elementThree: ElementRef;
  @ViewChild('elementFourId') elementFour: ElementRef;
  @ViewChild('elementFiveId') elementFive: ElementRef;

  doTour() {      
    var tour = {
      id: "hello-hopscotch",
      steps: [
        {
          title: "Willkommen!",
          content: "In diesem Tutorial werden Ihnen die einzelnen Funktionen dieser Notenverwaltungs-Software präsentiert.",
          target: this.elementOne.nativeElement,
          placement: "bottom"
        },
        {
          title: "Auswählen und Erstellen von Dateien",
          content: "Üblicherweise beginnen Sie ihre Arbeit indem Sie einen neuen Kurs erstellen oder auf eine bereits angelegte Datei zugreifen.",
          target: this.elementTwo.nativeElement,
          placement: "right"
        },
        {
          title: "Zuletzt verwendete Dateien",
          content: "Die Ansicht der zuletzt geöffneten Dateien ermöglicht Ihnen Listen- oder Symboldarstellung.",
          target: this.elementThree.nativeElement,
          placement: "bottom"
        },
        {
          title: "Step 3",
          content: "Klicken Sie nun auf Datei auswählen und öffnen Sie die Datei Example-Project.json.",
          target: this.elementFour.nativeElement,
          placement: "bottom",
          showNextButton:false,
          nextOnTargetClick:true,
          //showCTAButton: true,
          //ctaLabel: "Example öffnen",
          //onCTA: function() {
            //document.getElementById('file_selector').click();
          //}
        },
        {
          title: "NUMMER 4",
          content: "Üblicherweise beginnen Sie ihre Arbeit indem Sie einen neuen Kurs erstellen oder auf eine bereits angelegte Datei zugreifen.",
          target: this.elementFive.nativeElement,
          placement: "right"
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
}
