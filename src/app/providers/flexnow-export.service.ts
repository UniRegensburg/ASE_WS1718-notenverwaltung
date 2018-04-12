import { Injectable } from '@angular/core'
import { GlobalDataService, ToastService, CheckOsService } from './index';

declare var require: any;

var fs = require('fs');

@Injectable()
export class flexNowExportService {

  private current_project: any;
  private current_project_name: any;
  private filePath: any;
  private current_project_results: any;
  private current_project_students: any;
  private current_project_grading: any;

  constructor(private dataService: GlobalDataService, private toastService: ToastService, private osService: CheckOsService) { }

  public export(): void {
      var app = require('electron').remote;
      var dialog = app.dialog
      var slash = this.osService.getSlashFormat()
    this.dataService.getCurrentProject().subscribe(current_project => {
      this.current_project = current_project;
      this.current_project_name = this.current_project.title;
      this.current_project_students = this.current_project.teilnehmer;
      this.current_project_results = this.current_project.bewertung;
      this.current_project_grading = this.current_project.bewertungsschema;
      var chooseFolder = new Promise((resolve, reject) => {
        dialog.showOpenDialog({ properties: ['openDirectory'] }, (fileNames) => {
          if (fileNames === undefined) {
             this.toastService.setError("Keinen Ordner ausgewählt.")
        }else{
        this.filePath = fileNames[0]+ slash +"FlexNow_export_"+ this.current_project_name.replace(/\W/g,"_")+".csv";
        resolve();
        }
        });
      });
      chooseFolder.then(() => {
      //  https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback
      var self = this;
      var stream = fs.createWriteStream(this.filePath);
      stream.once('open', function(fd) {
        stream.write("StudentName,StudentVorname,Matrikelnummer,Note");
        for (let student of self.current_project_students) {
          var line = "\n" + student.name + "," + student.vorname + "," + student.mtknr + "," + student.grade;
          stream.write(line);
        }
        stream.end();
      });
      this.toastService.success("Datei erfolgreich gespeichert.")
      });
    });
  }

  private openDialog(): void{

  }
}
