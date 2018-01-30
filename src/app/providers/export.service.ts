import { Injectable } from '@angular/core';
import { GlobalDataService , lsfExportService} from './index';


@Injectable()
export class ExportService{

    private current_project: any;
    constructor(private dataService: GlobalDataService) {}


    public export(string):void{
        this.dataService.getCurrentProject().subscribe(current_project =>{
            this.current_project = current_project;
        });
        switch(string){
            case "lsf":
                // this.lsfService.export(this.current_project)
                this.lsfExport(this.current_project)
                break;
            case "grips":
                this.gripsExport(this.current_project)
                break;
                // this.grips.export(this.current_project)
        }

    }

    private lsfExport(data): void{
        console.log("LSF: "+ data)
    }
    // TODO:
    private gripsExport(data): void{
        console.log("GRIPS: "+ data)

    }
}
