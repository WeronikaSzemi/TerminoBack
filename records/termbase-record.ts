import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/error";
import {TermbaseEntity} from "../types";

export type TermbaseRecordResults = [TermbaseRecord[], FieldPacket[]];

export class TermbaseRecord implements TermbaseEntity {
    termbaseId?: string;
    termbaseName: string;
    userName: string;

    constructor(obj: TermbaseEntity) {
        const {termbaseId, termbaseName, userName} = obj;

        if (termbaseName === '') {
            throw new ValidationError(`Nazwa słownika nie może być pustym tekstem.`);
        }
        if (termbaseName.length < 3) {
            throw new ValidationError(
                `Nazwa słownika musi składać się z co najmniej trzech znaków. Aktualnie zawiera ich ${termbaseName.length}.`);
        }
        if (termbaseName.length > 30) {
            throw new ValidationError(
                `Nazwa słownika może składać się z maksymalnie 30 znaków. Aktualnie zawiera ich ${termbaseName.length}.`);
        }

        this.termbaseId = termbaseId ?? uuid();
        this.termbaseName = termbaseName;
        this.userName = userName;
    }

    static async getOne(userName: string, termbaseName: string): Promise<TermbaseRecord> {
        if (!termbaseName) {
            throw new ValidationError('Nie podano nazwy słownika.');
        }

        const [results] = await pool.execute('SELECT * FROM `termbases` WHERE `termbaseName` = :termbaseName', {
            termbaseName,
        }) as TermbaseRecordResults;

        return results.length === 0 ? null : new TermbaseRecord(results[0]);
    }

    static async getAll(userName: string): Promise<TermbaseRecord[]> {
        const [results] = await pool.execute(
            'SELECT * FROM `termbases` WHERE `userName` = :userName ORDER by `termbaseName` ASC', {
                userName,
            }) as TermbaseRecordResults;
        return results.map(obj => new TermbaseRecord(obj));
    }

    async add(): Promise<void> {

        if (!this.termbaseId) {
            this.termbaseId = uuid();
        }

        const sql = `CREATE TABLE \`${this.userName}_${this.termbaseName}\` (\`id\` VARCHAR(36) NOT NULL DEFAULT uuid(), \`term\` VARCHAR(50) NOT NULL, \`termSource\` VARCHAR(100) NULL, \`termDefinition\` VARCHAR(300) NULL, \`termDefinitionSource\` VARCHAR(100) NULL, \`termCollocations\` VARCHAR(300) NULL, \`equivalent\` VARCHAR(50) NOT NULL, \`equivalentSource\` VARCHAR(100) NULL, \`equivalentDefinition\` VARCHAR(300) NULL, \`equivalentDefinitionSource\` VARCHAR(100) NULL, \`equivalentCollocations\` VARCHAR(300) NULL, PRIMARY KEY (\`id\`)) COLLATE=utf8mb4_unicode_ci;`;

        await pool.execute(sql);
        await pool.execute('INSERT INTO `termbases` (`termbaseName`, `userName`) VALUES (:termbaseName, :userName)', {
            termbaseName: `${this.userName}_${this.termbaseName}`,
            userName: this.userName,
        });
    }

    async drop(): Promise<void> {
        if (!this.termbaseName) {
            throw new ValidationError('Nie wskazano słownika do usunięcia.');
        }
        const sql = `DROP TABLE ${this.termbaseName}`;
        await pool.execute(`${sql}`);
        await pool.execute('DELETE FROM `termbases` WHERE `termbaseName` = :termbaseName', {
            termbaseName: this.termbaseName,
        });
    }
}