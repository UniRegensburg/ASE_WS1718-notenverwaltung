import { Injectable } from '@angular/core'

@Injectable()
export class lsfExportService{

    constructor(){}

    public export(data){
        console.log("LSF", data)
    }

}
