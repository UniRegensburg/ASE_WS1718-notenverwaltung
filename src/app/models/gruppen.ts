import { Teilnehmer } from './index'

export class Gruppen {
    private id: number;
    private punkte: number;
    private studenten: Array<Teilnehmer>;
    private comment_privat?: string; //optional parameter
    private comment_public?: string; //optional parameter
}



