import { Component, OnInit } from '@angular/core';
import { GlobalDataService, gripsExportService, lsfExportService } from '../../../providers/index';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;


  constructor(public grips: gripsExportService, public lsf: lsfExportService) { }

  ngOnInit() {

  }

  export(string):void{
      // this.exportService.export(string)
      switch(string){
          case "lsf":
              // this.lsfService.export(this.current_project)
              this.lsf.export()
              break;
          case "grips":
              this.grips.export()
              break;
              // this.grips.export(this.current_project)
      }
  }

}
