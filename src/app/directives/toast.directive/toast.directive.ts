import {Component, OnInit, OnDestroy} from '@angular/core';
import {ToastService} from '../../providers/toast.service';
import {Subscription} from 'rxjs/Subscription';
import { log } from 'util';

@Component({
  moduleId: module.id,
  selector: 'toast', 
  styleUrls: ['./toast.directive.scss'],
  templateUrl: 'toast.directive.html'
})

export class ToastComponent implements OnInit, OnDestroy {
  message: any = null;
  private subscription: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    if (this.toastService.getStatusText()) {
      this.message = {text: this.toastService.getStatusText()};
    }
    this.subscription = this.toastService.getMessage().subscribe(    
      message => { 
        this.message = message; 
        setTimeout(()=>{  
          if(this.message != null){
            this.message = null;     
          }    
        }, 10000);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}