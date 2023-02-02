import {ValidationError} from "../utils/error";
import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {TermEntity} from "../types";
import {FieldPacket} from "mysql2";

type TermRecordResults = [TermRecord[], FieldPacket[]];

export class TermRecord implements TermEntity {
    public id?: string;
    public readonly createdAt?: Date;
    public lastModifiedAt?: Date;
    public term: string;
    public termSource?: string;
    public termDefinition?: string;
    public termDefinitionSource?: string;
    public termCollocations?: string[];
    public equivalent: string;
    public equivalentSource?: string;
    public equivalentDefinition?: string;
    public equivalentDefinitionSource?: string;
    public equivalentCollocations?: string[];

    constructor(obj: TermEntity) {
        const {
            id,
            createdAt,
            lastModifiedAt,
            term,
            termSource,
            termDefinition,
            termDefinitionSource,
            termCollocations,
            equivalent,
            equivalentSource,
            equivalentDefinition,
            equivalentDefinitionSource,
            equivalentCollocations
        } = obj;

        if (term === '') throw new ValidationError(`Termin nie może być pustym tekstem.`);
        if (term.length < 3) throw new ValidationError(
            `Termin musi zawierać co najmniej trzy znaki. Aktualnie zawiera ${term.length}.`);
        if (term.length > 50) throw new ValidationError(
            `Termin musi zawierać maksymalnie 50 znaków. Aktualnie zawiera ${term.length}.`);

        if (equivalent === '') throw new ValidationError(`Ekwiwalent nie może być pustym tekstem.`);
        if (equivalent.length < 3) throw new ValidationError(
            `Ekwiwalent musi zawierać co najmniej trzy znaki. Aktualnie zawiera ${equivalent.length}.`);
        if (equivalent.length > 50) throw new ValidationError(
            `Ekwiwalent musi zawierać maksymalnie 50 znaków. Aktualnie zawiera ${equivalent.length}.`);

        this.id = id ?? uuid();
        this.createdAt = createdAt ?? null;
        this.lastModifiedAt = lastModifiedAt ?? null;
        this.term = term;
        this.termSource = termSource ?? null;
        this.termDefinition = termDefinition ?? null;
        this.termDefinitionSource = termDefinitionSource ?? null;
        this.termCollocations = termCollocations ?? null;
        this.equivalent = equivalent;
        this.equivalentSource = equivalentSource ?? null;
        this.equivalentDefinition = equivalentDefinition ?? null;
        this.equivalentDefinitionSource = equivalentDefinitionSource ?? null;
        this.equivalentCollocations = equivalentCollocations ?? null;
    }

    static async getOne(id: string): Promise<TermRecord | null> {
        if (!id) {
            throw new ValidationError('Brakuje ID terminu.');
        }

        const [results] = await pool.execute('SELECT * FROM `colours` WHERE `id` = :id', {
            id,
        }) as TermRecordResults;

        return results.length === 0 ? null : new TermRecord(results[0]);
    }

    static async getAll(): Promise<TermRecord[]> {
        const [results] = await pool.execute('SELECT * FROM `colours` ORDER by `term` ASC') as TermRecordResults;
        return results.map(obj => new TermRecord(obj));

        /*@TODO: dodać parametr wskazujący na sposób sortowania: najstarsze/najnowsze albo alfabetycznie; dodać też datę w bazie*/
    }

    async add(): Promise<string> {

        await pool.execute(
            'INSERT INTO `colours`(`id`, `createdAt`, `lastModifiedAt`, `term`, `termSource`, `termDefinition`, `termDefinitionSource`, `termCollocations`, `equivalent`, `equivalentSource`, `equivalentDefinition`, `equivalentDefinitionSource`, `equivalentCollocations`) VALUES(:id, :createdAt, :lastModifiedAt, :term, :termSource, :termDefinition, :termDefinitionSource, :termCollocations, :equivalent, :equivalentSource, :equivalentDefinition, :equivalentDefinitionSource, :equivalentCollocations)',
            {
                id: this.id,
                createdAt: new Date(),
                lastModifiedAt: new Date(),
                term: this.term,
                termSource: this.termSource,
                termDefinition: this.termDefinition,
                termDefinitionSource: this.termDefinitionSource,
                termCollocations: this.termCollocations,
                equivalent: this.equivalent,
                equivalentSource: this.equivalentSource,
                equivalentDefinition: this.equivalentDefinition,
                equivalentDefinitionSource: this.equivalentDefinitionSource,
                equivalentCollocations: this.equivalentCollocations,
            });

        return this.id;
    }

    async edit(obj: TermEntity): Promise<number> {
        /*@TODO: dodać walidację, czy jest termin o takim ID -- w routerze*/

        if (!this.id) {
            throw new ValidationError('Brakuje ID terminu.');
        }

        const answer = await pool.execute('UPDATE `colours` SET `term` = :term, `term_source` = :termSource,' +
            ' `term_definition` = :termDefinition, `term_definition_source` = :termDefinitionSource, `term_collocations` = :termCollocations, `equivalent` = :equivalent, `equivalent_source` = :equivalentSource, `equivalent_definition` = :equivalentDefinition, `equivalent_definition_source` = :equivalentDefinitionSource, `equivalent_collocations` = :equivalentCollocations WHERE `id` = :id',
            {
                id: obj.id,
                term: obj.term,
                termSource: obj.termSource,
                termDefinition: obj.termDefinition,
                termDefinitionSource: obj.termDefinitionSource,
                termCollocations: obj.termCollocations,
                equivalent: obj.equivalent,
                equivalentSource: obj.equivalentSource,
                equivalentDefinition: obj.equivalentDefinition,
                equivalentDefinitionSource: obj.equivalentDefinitionSource,
                equivalentCollocations: obj.equivalentCollocations,
            });
        return (JSON.parse(JSON.stringify(answer)))[0].affectedRows;
    }

    async delete(): Promise<void> {
        /*@TODO: dodać walidację, czy jest termin o takim ID -- w routerze*/

        if (!this.id) {
            throw new ValidationError('Brakuje ID terminu.');
        }

        const answer = await pool.execute('DELETE FROM `colours` WHERE `id` = :id', {
            id: this.id,
        });

        return (JSON.parse(JSON.stringify(answer)))[0].affectedRows;
    }
}
