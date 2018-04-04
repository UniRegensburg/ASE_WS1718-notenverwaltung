import { Injectable } from '@angular/core';

@Injectable()
export class CheckOsService{

    public operatingSystem: String;

    constructor() {
    }
   
    slashFormat(): string {
        let returnValue;
        console.log(process.platform);
        if(process.platform == 'win32'){
            returnValue = '\\';
        }
        else{
            returnValue = '/';
        }
        return returnValue;
    }

}     