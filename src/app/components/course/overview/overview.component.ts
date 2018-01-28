import { Component, OnInit } from '@angular/core';
import { GlobalDataService } from '../../../providers/index';

@Component({
  selector: 'app-course-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;

  constructor(public dataService: GlobalDataService) { }

  ngOnInit() {
    console.log("HERE");
    
    console.log(this.dataService.getCurrentProject());
  }

}
