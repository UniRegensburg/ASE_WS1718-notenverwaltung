import {Component, OnInit, OnDestroy} from '@angular/core';
import {ToastService} from '../../providers/toast.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  moduleId: module.id,
  selector: 'toast',
  templateUrl: 'toast.directive.html'
})

export class ToastComponent implements OnInit, OnDestroy {
  message: any;
  private subscription: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    if (this.toastService.getStatusText()) {
      this.message = {text: this.toastService.getStatusText()};
    }
    this.subscription = this.toastService.getMessage().subscribe(message => {this.message = message; });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}