import { Bewertung, Teilnehmer, Bewertungsschema } from './index'

export class Schema {
    constructor(
        teilnehmer: Array<Teilnehmer>,
        bewertungsschema: Bewertungsschema,
        bewertung: Array<Bewertung>
    ){
        this.teilnehmer = teilnehmer;
        this.bewertungsschema = bewertungsschema;
        this.bewertung = bewertung;
    }
    private teilnehmer: Array<Teilnehmer>;
    private bewertungsschema: Bewertungsschema;
    private bewertung: Array<Bewertung>;
}