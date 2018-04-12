import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable()
export class CheckOsService{

    public deviceInfo;

    constructor(private deviceService: DeviceDetectorService) {
        this.deviceInfo = this.deviceService.getDeviceInfo();
    }
   
    getSlashFormat(): string {
        let returnValue;

        if(this.deviceInfo.os == 'windows'){
            returnValue = '\\';
        }
        else{
            returnValue = '/';
        }
        return returnValue;
    }

}     