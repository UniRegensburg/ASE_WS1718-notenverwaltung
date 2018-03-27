import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'searchStudent'})
export class SearchStudentPipe implements PipeTransform {

  private fitSearch(item: string, field:string): boolean{
    let returnVal = false;
    if(item.includes(field)){
      returnVal = true;
    }
    return returnVal;
  }

  transform(items: any[], field: string): any[] {   
   if (!field || field.trim() === '') return items;
   return items.filter(item => {
     return this.fitSearch(JSON.stringify(item).toLowerCase(), field.toLowerCase());
   });
  }
}
