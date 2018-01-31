import { Injectable } from '@angular/core'
import { GlobalDataService} from './index';

declare var require: any;

var fs = require('fs');

@Injectable()
export class lsfExportService{

    private current_project: any;
    private current_project_name: any;
    private filePath: any;
    private current_project_results: any;
    private current_project_students: any;

    constructor(private dataService: GlobalDataService) {}

    public export(): void{
        this.dataService.getCurrentProject().subscribe(current_project =>{
            this.current_project = current_project;
        });
        this.dataService.getCurrentProjectName().subscribe(current_project_name => {
            this.current_project_name = current_project_name;
        });
        this.current_project_students = this.current_project.teilnehmer
        this.current_project_results = this.current_project.bewertung
        this.filePath = this.current_project_name.substring(0,this.current_project_name.lastIndexOf("\\")+1)+ "lsf_export.csv";

        //  https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback
        var self = this;
        var stream = fs.createWriteStream(this.filePath)
        stream.once('open', function(fd){
            // TODO: aufgabennummer variabel machen
            stream.write("StudentName,StudentVorname,Matrikelnummer,Aufgabe1,Aufgabe2,Aufgabe3,Aufgabe4\n")

            for (let result of self.current_project_results){
                for (let student of self.current_project_students){
                    if (result.student_id === student.id){
                        console.log(result.einzelwertungen[0])
                        var line = student.name+","+student.vorname+","+student.mtknr+","+result.einzelwertungen[0].erreichte_punkte+","+result.einzelwertungen[1].erreichte_punkte+","+result.einzelwertungen[2].erreichte_punkte+"\n"
                        stream.write(line)


                    }
                }
            }
            stream.end()
        });
        // TODO: schöner machen
        alert("File written to:" + this.filePath)
    }

}
