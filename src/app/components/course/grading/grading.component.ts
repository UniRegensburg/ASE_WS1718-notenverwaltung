import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grading',
  templateUrl: './grading.component.html',
  styleUrls: ['./grading.component.scss']
})
export class GradingComponent implements OnInit {
  title = `Notenverwaltung ASE WS17/18 !`;
  schemeCreateMode = false;
  schemeEdit = false;
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
                "notenschluessel": {
                    "note": ["1", "2", "3"],
                    "obergrenze": ["100", "95", "90"],
                    "untergrenze": ["95", "90", "80"]

                },
                "bewertungseinheit": ""
            },
            "aufgaben": [
                {
                    "id": 0,
                    "position": 0,
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
    gradingGrade = this.json.bewertungsschema.allgemeine_infos.notenschluessel.note;
    gradingMax = this.json.bewertungsschema.allgemeine_infos.notenschluessel.obergrenze;
    gradingMin = this.json.bewertungsschema.allgemeine_infos.notenschluessel.untergrenze;
  
  constructor() {
  
  }

  ngOnInit() {
  
   
    console.log(this.json.teilnehmer[0].name);
    console.log(this.json.bewertungsschema.allgemeine_infos.notenschluessel);
    console.log("hier");

  
  }
  
  

  
  setCreateMode(new_status): void{
    this.schemeCreateMode = new_status;
  console.log(this.schemeCreateMode);
  }

}
