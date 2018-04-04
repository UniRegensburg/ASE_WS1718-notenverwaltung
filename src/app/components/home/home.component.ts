import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { log, error } from 'util';
import { Router } from '@angular/router';

import { GlobalDataService, LastOpened, ToastService } from '../../providers/index';


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

  constructor(
    public dataService: GlobalDataService,
    public router: Router,
    public lastOpened: LastOpened,
    private changeDetectorRef: ChangeDetectorRef,
    public toastService: ToastService
  ) { }

  ngOnInit() {
    this.last_files = this.lastOpened.getLastOpendFiles();
  }

  onChange(file) {
    this.dataService.getLocalFile(file['0'].path).subscribe(
      data => {
        if(this.dataService.checkJsonValidity() == 1){
            this.toastService.setError("Datei nicht erkannt. Bitte wählen Sie eine valide Datei aus.")
        }
        else{
            this.router.navigate(['course/overview']);
        }
      },
      err => {
        this.toastService.setError("Datei nicht erkannt. Bitte wählen Sie eine valide Datei aus.")

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

      this.dataService.getLocalFile(fileNames[0]).subscribe(data => {
        ///this.changeDetectorRef.detectChanges();
        this.router.navigate(['course/overview']);
      });
    });
  }
}
