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
    public termCollocations?: string;
    public equivalent: string;
    public equivalentSource?: string;
    public equivalentDefinition?: string;
    public equivalentDefinitionSource?: string;
    public equivalentCollocations?: string;

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

        if (term === '') {
            throw new ValidationError(`Termin nie może być pustym tekstem.`)
        }
        if (term.length < 3) {
            throw new ValidationError(
                `Termin musi zawierać co najmniej trzy znaki. Aktualnie zawiera ${term.length}.`)
        }
        if (term.length > 50) {
            throw new ValidationError(
                `Termin musi zawierać maksymalnie 50 znaków. Aktualnie zawiera ${term.length}.`)
        }

        if (equivalent === '') {
            throw new ValidationError(`Ekwiwalent nie może być pustym tekstem.`)
        }
        if (equivalent.length < 3) {
            throw new ValidationError(
                `Ekwiwalent musi zawierać co najmniej trzy znaki. Aktualnie zawiera ${equivalent.length}.`)
        }
        if (equivalent.length > 50) {
            throw new ValidationError(
                `Ekwiwalent musi zawierać maksymalnie 50 znaków. Aktualnie zawiera ${equivalent.length}.`)
        }

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

    static async getOne(userName: string, termbaseName: string, id: string): Promise<TermRecord | null> {
        if (!id) {
            throw new ValidationError('Brakuje ID terminu.');
        }

        const fullTermbaseName = `${userName}_${termbaseName}`;

        const sql = `SELECT * FROM \`${fullTermbaseName}\` WHERE \`id\` = :id`;
        const [results] = await pool.execute(sql, {
            id,
        }) as TermRecordResults;

        return results.length === 0 ? null : new TermRecord(results[0]);
    }

    static async getAll(userName: string, termbaseName: string): Promise<TermRecord[]> {
        const fullTermbaseName = `${userName}_${termbaseName}`;

        const sql = `SELECT * FROM \`${fullTermbaseName}\` ORDER by \`term\` ASC`;

        const [results] = await pool.execute(sql) as TermRecordResults;
        return results.map(obj => new TermRecord(obj));

        /*@TODO: dodać parametr wskazujący na sposób sortowania: najstarsze/najnowsze albo alfabetycznie; dodać też datę w bazie*/
    }

    async add(userName: string, termbaseName: string): Promise<void> {

        const fullTermbaseName = `${userName}_${termbaseName}`;

        const sql = `INSERT INTO \`${fullTermbaseName}\`(\`id\`, \`term\`, \`termSource\`, \`termDefinition\`, \`termDefinitionSource\`, \`termCollocations\`, \`equivalent\`, \`equivalentSource\`, \`equivalentDefinition\`, \`equivalentDefinitionSource\`, \`equivalentCollocations\`) VALUES(:id, :term, :termSource, :termDefinition, :termDefinitionSource, :termCollocations, :equivalent, :equivalentSource, :equivalentDefinition, :equivalentDefinitionSource, :equivalentCollocations)`
        await pool.execute(
            sql,
            {
                id: this.id,
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

    }

    async edit(userName: string, termbaseName: string, obj: TermEntity): Promise<void> {
        /*@TODO: dodać walidację, czy jest termin o takim ID -- w routerze*/

        const fullTermbaseName = `${userName}_${termbaseName}`;

        if (!this.id) {
            throw new ValidationError('Brakuje ID terminu.');
        }

        const sql = `UPDATE \`${fullTermbaseName}\` SET \`term\` = :term, \`termSource\` = :termSource, \`termDefinition\` = :termDefinition, \`termDefinitionSource\` = :termDefinitionSource, \`termCollocations\` = :termCollocations, \`equivalent\` = :equivalent, \`equivalentSource\` = :equivalentSource, \`equivalentDefinition\` = :equivalentDefinition, \`equivalentDefinitionSource\` = :equivalentDefinitionSource, \`equivalentCollocations\` = :equivalentCollocations WHERE \`id\` = :id`;
        await pool.execute(sql, {
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
    }

    async delete(userName: string, termbaseName: string): Promise<void> {
        /*@TODO: dodać walidację, czy jest termin o takim ID -- w routerze*/

        const fullTermbaseName = `${userName}_${termbaseName}`;

        if (!this.id) {
            throw new ValidationError('Brakuje ID terminu.');
        }

        const sql = `DELETE FROM \`${fullTermbaseName}\` WHERE \`id\` = :id`;
        await pool.execute(sql, {
            id: this.id,
        });
    }
}
