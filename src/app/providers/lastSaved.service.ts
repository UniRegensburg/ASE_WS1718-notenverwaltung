import { Injectable } from '@angular/core';

@Injectable()
export class lastSavedService{
    private lastUpdated: any;
    constructor(){
        this.lastUpdated = new Date()
    }

    public save(){
        this.lastUpdated = new Date()
    }

    public getTime(){
        return this.lastUpdated
    }
}
