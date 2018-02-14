import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { GlobalDataService } from '../../../../providers/index'
import {
  ActivatedRoute
} from '@angular/router';

declare var require: any;
declare var $: any;

@Component({
  selector: 'app-students-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;
  private sub: any;

  constructor(public dataService: GlobalDataService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params) {
        console.log(params);
        
      }
    });
  }

}
