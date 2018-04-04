import { Bewertung, Teilnehmer, Bewertungsschema } from './index'

export class Schema {
    constructor(
        title?: string,
        teilnehmer?: Array<Teilnehmer>,
        bewertungsschema?: Bewertungsschema,
        bewertung?: Array<Bewertung>
    ){
        this.title = title;
        this.teilnehmer = teilnehmer;
        this.bewertungsschema = bewertungsschema;
        this.bewertung = bewertung;
    }
    private title: string;
    private teilnehmer: Array<Teilnehmer>;
    private bewertungsschema: Bewertungsschema;
    private bewertung: Array<Bewertung>;
}