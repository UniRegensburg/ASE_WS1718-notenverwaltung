import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';

import { GlobalDataService, LastOpened, ToastService } from '../../providers/index';

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
  private last_files: Array<any> = [];
  private error_code: string = "Datei nicht erkannt. Wählen Sie eine valide Datei aus.";
  private view_mode: boolean = true;
  private tour;

  @ViewChild('welcome') welcome: ElementRef;
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
          target: this.welcome.nativeElement,
          placement: "bottom"
        },
        {
          title: "Einführende Informationen...",
          content: "Vorab drei kleine Hinweise: Diese Software funktioniert komplett unabhängig von Internetverfügbarkeit. Jeder von Ihnen vorgenommene Arbeitsschritt wird automatisch gespeichert. Gespeicherte Daten werden sicher verschlüsselt und können nur innerhalb dieser Software ausgelesen werden. All dies geschieht im Hintergrund, um Ihnen höchsten Komfort und Ihren Daten die größtmögliche Sicherheit zukommen zu lassen.",
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
    public toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.lastOpened.getLastOpendFiles().subscribe(
      data => {
        this.last_files = data;  
        this.last_files.forEach(file => {
          file.file_name = file.path.replace(/^.*[\\\/]/, '');
          let dateObj = new Date(file.last_opened);
          file.last_opened = String(dateObj.getDate()) + "." 
          + String(dateObj.getMonth() + 1) + "." 
          + dateObj.getFullYear() + " um " 
          + dateObj.getHours() + ":" 
          + (dateObj.getMinutes()<10?'0':'') + dateObj.getMinutes();
        });      
      }
    );
  }

  onChange(file) {   
    this.dataService.getLocalFile(file['0'].path).subscribe(
      data => {                
        if(this.dataService.checkJsonValidity() == 1){
          this.toastService.setError(this.error_code);
        }
        else{
          this.router.navigate(['course/overview']);
        }
      },
      err => {                
        this.toastService.setError(this.error_code);
        this.lastOpened.deleteFileFromList(file['0'].path).subscribe(files => {
          this.dataService.checkLastOpendFiles();
          this.last_files = files;
        });  
      }
    );
  }
  
  openDialog() {
    var app = require('electron').remote;
    var dialog = app.dialog;

    dialog.showOpenDialog((fileNames) => {
      if (fileNames === undefined) {
          this.toastService.setError("Keine Datei ausgewählt. Bitte wählen Sie eine Datei aus.")

        return;
      }
      this.router.navigate(['course/overview']);

      this.dataService.getLocalFile(fileNames[0]).subscribe(
        data => {        
          this.router.navigate(['course/overview']);
        },
        eror => {
          console.log("File not recognized. Please select a valid file.");
        });
    });
  }
}
