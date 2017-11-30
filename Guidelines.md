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
