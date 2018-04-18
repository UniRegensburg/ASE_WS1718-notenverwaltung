import { Injectable } from '@angular/core';
import { GlobalDataService, ToastService} from './index';

declare var require: any;

var fs = require('fs');

@Injectable()
export class gripsExportService{

    private current_project: any;
    private current_project_name: any;
    private filePath: any;
    private current_project_results: any;
    private current_project_students: any;

    constructor(private dataService: GlobalDataService, private toastService: ToastService) {}

    public export():void{
        this.dataService.getCurrentProject().subscribe(current_project =>{
            this.current_project = current_project;
            this.current_project_name = this.current_project.title;
            this.current_project_students = this.current_project.teilnehmer;
            this.current_project_results = this.current_project.bewertung;
            this.filePath = this.current_project_name.substring(0,this.current_project_name.lastIndexOf("\\")+1)+ "grips_export.csv";
            //  https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback
            var self = this;
            // var stream = fs.createWriteStream(this.filePath);
            // stream.once('open', function(fd){
            //     // stream.write("StudentID,StudentName,StudentVorname,Aufgabe,Punkte,PrivaterKommentar,OeffentlicherKommentar\n")
            //     //
            //     // for (let result of self.current_project_results){
            //     //     for (let student of self.current_project_students){
            //     //         if (result.student_id === student.id){
            //     //             for (let aufgabe of result.einzelwertungen){
            //     //                 // var line = student.id+","+student.name+","+student.vorname+","+aufgabe.aufgaben_id+";"+aufgabe.erreichte_punkte+","+aufgabe.comment_privat+","+aufgabe.comment_public+"\n";
            //     //                 // stream.write(line);
            //     //             }
            //     //
            //     //         }
            //     //     }
            //     // }
            //     stream.end();
            // });
            this.toastService.setError("Datenexport zu GRIPS noch nicht implementiert")
        });
    }
}
