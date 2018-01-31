import { Injectable } from '@angular/core';
import { GlobalDataService} from './index';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { saveAs } from 'file-saver';



@Injectable()
export class gripsExportService{

    private current_project: any;
    private current_project_name: any;
    private filePath: any;
    private current_project_results: any;
    constructor(private dataService: GlobalDataService) {}


    public export():void{
        this.dataService.getCurrentProject().subscribe(current_project =>{
            this.current_project = current_project;
        });
        this.dataService.getCurrentProjectName().subscribe(current_project_name => {
            this.current_project_name = current_project_name;
        });
        this.current_project_results = this.current_project.bewertung
        console.log(this.current_project_results)
        // this.filePath = this.current_project_name;
        // console.log(this.filePath)
        this.filePath = this.current_project_name.substring(0,this.current_project_name.lastIndexOf("\\")+1);
        // console.log(this.current_project_results, fs.readFileSync(this.current_project_name))


        // var file = new Angular2Csv(this.current_project, 'download')
        var file = new Blob([this.current_project_results],{type: 'text/csv'});
        saveAs(file,"download.csv")
        // writeFile(this.filePath,file, (err) => {
        //     if(err){
        //         alert("An error ocurred creating the file "+ err.message);
        //     }
        //     else{
        //       alert("The file has been succesfully saved");
        //
        //   }
        // });

    }



}
