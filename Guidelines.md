# Unsere Git Guidelines
Version 1.0 vom 30.11.2017

## Wir
... machen möglichst atomare Commits

... beschreiben was in dem Commit passiert ist in der Commit-Message

... schreiben Commit-Messages prägnant in englischer Sprache im Infinitiv, ohne Satzzeichen am Ende, mit ‘#Ticket-ID’ 

... nehmen pro Feature einen eigenen Branch

... committen nie direkt auf den Master-Branch

... stellen, wenn wir mit unserem Branch fertig sind einen Pull Request zum develop-Branch

... ziehen den develop-Branch nur dann auf den master-Branch, wenn dieser garantiert fehlerfrei und so weit wie möglich refactored ist

## Exemplarischer Arbeitsablauf:
1. Ich möchte einen Bug beheben oder ein Feature implementieren
2. Ich wechsle auf den develop-Branch
3. `git fetch && git pull` 
4. `git checkout -b feature/xyz` oder bug/xyz
5. Auf diesem neuen Branch wird immer, wenn ein Teilerfolg erzielt wird, committet
6. Ist der Bug behoben oder das Feature implementiert, stelle ich einen Pull Request
7. Jeder andere Entwickler darf diesen Branch nun auschecken und testen, sowie den Code begutachten. Ist beides ok, darf dieser Entwickler den PR mergen, ist er nicht ok, wird kommentiert warum und der PR geschlossen


## Versions-Tags
Bei jedem Merge auf Master muss die Version getaggt werden.
Unser Versionstagging hat folgendes Schema, wobei die Buchstaben für ganze Zahlen stehen:

|a.| b. | c. | d
|--|--|--|--|
| Relase |  Milestone| Development Stage | Merge in Master 

### Development Stage

>  - 0 for alpha (status)
>  - 1 for beta (status)
>  - 2 for release candidate
>  - 3 for (final) release
>  
https://en.wikipedia.org/wiki/Software_versioning#Designating_development_stage


### Beispiel
| Tag | Beschreibung|
| --- | --- |
| `0.0.0.1` | SW noch nie released, 0ter Milestone, Alpha-Status, erster Merge in Masterbranch |
| `1.12.1.102` | nach dem ersten Release, zwölfter Milestone, Beta-Status, hundertzweiter Merge in Masterbranch |
