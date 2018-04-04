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

  @ViewChild('siteHeader') siteHeader: ElementRef;
  @ViewChild('lastUsed') lastUsed: ElementRef;
  @ViewChild('viewIcons') viewIcons: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('tutButton') tutButton: ElementRef;

  doTour() {      
    var tour = {
      id: "home-tutorial",
      steps: [
        {
          title: "Willkommen!",
          content: "In diesem Tutorial werden Ihnen die einzelnen Funktionen dieser Notenverwaltungs-Software präsentiert.",
          target: this.siteHeader.nativeElement,
          placement: "bottom"
        },
        {
          title: "Auswählen und Erstellen von Dateien...",
          content: "Üblicherweise beginnen Sie ihre Arbeit indem Sie einen neuen Kurs erstellen oder auf eine bereits angelegte Datei zugreifen.",
          target: this.lastUsed.nativeElement,
          placement: "right"
        },
        {
          title: "Zuletzt verwendete Dateien...",
          content: "Die Ansicht der zuletzt geöffneten Dateien ermöglicht Ihnen Listen- oder Symboldarstellung.",
          target: this.viewIcons.nativeElement,
          placement: "bottom"
        },
        {
          title: "Eine Datei auswählen...",
          content: "Klicken Sie nun auf Datei auswählen und öffnen Sie die Datei Example-Project.json.",
          target: this.fileInput.nativeElement,
          placement: "bottom",
          showNextButton:false,
          nextOnTargetClick:true,
        },
        {
          title: "Glückwunsch!",
          content: "Sie haben den ersten Teil des Tutorials abgeschlossen. Abhängig davon welchen Bereich der Software Sie gerade betrachten, können Sie sich bei Bedarf die zugehörigen Funktionen per Klick auf den Tutorial-Button erläutern lassen.",
          target: this.tutButton.nativeElement,
          placement: "left",
          yOffset: -130, 
          arrowOffset: 150,
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
