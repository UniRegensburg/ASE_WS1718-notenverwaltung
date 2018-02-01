import { Component, OnInit } from '@angular/core';
import { GlobalDataService, ExportService } from '../../../providers/index';

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;
  
  private current_project: any;
  
  schemeEditMode = false;
  json = {
        "teilnehmer": [
            {
                "id": 1,
                "mtknr": 1655429,
                "name": "Guder",
                "vorname": "Markus",
                "studiengang": "M.Sc. Medieninfo (1)",
                "fachsemester": 1,
                "mail": "markus.guder@gmail.com",
                "status": "ZU"
            }
        ],
        "bewertungsschema": {
            "allgemeine_infos": {
                "notenschluessel": [
                     [1, 2, 3],
                     ["100", "95", "90"],
                     ["95", "90", "80"],
                     ["%","%","%"]

                ],
                "bewertungseinheit": ""
            },
            "aufgaben": [
                {
                    "id": 0,
                    "title": "Aufgabe 1",
                    "position": 0,
                    "gewichtung": 1.0,
                    "max_punkt": 0,
                    "comment_public": true,
                    "comment_privat": true,
                    "beschreibung": "its bad!",
                    "bewertungs_hinweis": "its really bad!"
                },
                 {
                    "id": 1,
                    "title": "Aufgabe 2",
                    "position": 1,
                    "gewichtung": 1.0,
                    "max_punkt": 0,
                    "comment_public": true,
                    "comment_privat": true,
                    "beschreibung": "its bad!",
                    "bewertungs_hinweis": "its really bad!"
                },
                 {
                    "id": 2,
                    "title": "Aufgabe 3",
                    "position": 2,
                    "gewichtung": 1.0,
                    "max_punkt": 0,
                    "comment_public": true,
                    "comment_privat": true,
                    "beschreibung": "its bad!",
                    "bewertungs_hinweis": "its really bad!"
                }
            ]
        },
        "bewertung": [
            {
                "student_id": 1,
                "aufgaben": [
                    {
                        "aufgaben_id": 0,
                        "erreichte_punkte": 0,
                        "comment_privat": "",
                        "comment_public": ""
                    }
                ]
            }
        ]
    };
    
    gradingKey = this.json.bewertungsschema.allgemeine_infos.notenschluessel;
    gradingGrade = this.json.bewertungsschema.allgemeine_infos.notenschluessel[0];
    gradingMax = this.json.bewertungsschema.allgemeine_infos.notenschluessel[1];
    gradingMin = this.json.bewertungsschema.allgemeine_infos.notenschluessel[2];
    gradingQuestion = this.json.bewertungsschema.aufgaben;
  
  constructor(public dataService: GlobalDataService) {
    
  }

  ngOnInit() {
    this.dataService.getCurrentProject().subscribe(data =>{
    this.current_project = data;
    console.log(this.current_project);
   });
   console.log("hier");
   console.log(this.gradingQuestion[1].title);
  }
  
  

  
  setEditMode(new_status): void{
    this.schemeEditMode = new_status;
  //console.log(this.schemeEditMode);
  console.log("EDITIER MODUS KNOPF GEKLICKT");
  }

}
