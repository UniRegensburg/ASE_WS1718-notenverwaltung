import {Component, OnInit, OnDestroy} from '@angular/core';
import {ToastService} from '../../providers/toast.service';
import {Subscription} from 'rxjs/Subscription';
import { log } from 'util';
import {trigger, transition, style, animate, state} from '@angular/animations'
import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

@Component({
  moduleId: module.id,
  selector: 'toast',
  animations: [
    trigger(
      'toastAnimation',
      [
        transition(
        ':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', 'opacity': 1}))
        ]
      ),
      transition(
        ':leave', [
          style({transform: 'translateX(0)', 'opacity': 1}),
          animate('500ms', style({transform: 'translateX(100%)', 'opacity': 0}))          
        ]
      )]
    )
  ],
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
        }, 6000);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}