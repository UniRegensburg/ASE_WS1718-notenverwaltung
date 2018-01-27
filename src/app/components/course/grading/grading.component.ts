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

  
  constructor() { }

  ngOnInit() {
  
      var json = {
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
                    ["note", "obergrenze", "untergrenze"],
                    ["note", "obergrenze", "untergrenze"],
                    ["note", "obergrenze", "untergrenze"]

                ],
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
    }

  
    console.log(json);
    console.log(this.schemeCreateMode);

  
  }
  
  setCreateMode(new_status): void{
  this.schemeCreateMode = new_status;
  console.log(this.schemeCreateMode);
  }

}
