export class File {
   private id: number;
   private file_name: string;
   private last_opend: string;
   private title: string;
   public path: string;

   constructor(id: number, file_name: string, last_opend: string, title: string, path: string){
       this.id = id;
       this.file_name = file_name;
       this.last_opend = last_opend;
       this.title = title;
       this.path = path;
   }
}