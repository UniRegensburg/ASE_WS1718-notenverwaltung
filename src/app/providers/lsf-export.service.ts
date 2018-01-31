import { Injectable } from '@angular/core'
import { GlobalDataService} from './index';

@Injectable()
export class lsfExportService{

    private current_project: any;
    constructor(private dataService: GlobalDataService) {}

    public export(): void{
        this.dataService.getCurrentProject().subscribe(current_project =>{
            this.current_project = current_project;
        });
        console.log(this.current_project)
    }

}
