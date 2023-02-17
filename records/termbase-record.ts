import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/error";
import {TermbaseEntity} from "../types";

type TermbaseRecordResults = [TermbaseRecord[], FieldPacket[]];

export class TermbaseRecord implements TermbaseEntity {
    termbaseId?: string;
    termbaseName: string;
    createdAt: Date;
    lastModifiedAt: Date;
    userName: string;

    constructor(obj: TermbaseEntity) {
        const {termbaseId, termbaseName, createdAt, lastModifiedAt, userName} = obj;

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
        this.createdAt = createdAt;
        this.lastModifiedAt = lastModifiedAt;
        this.userName = userName;
    }

    static async getAll(userName: string): Promise<TermbaseRecord[]> {
        const [results] = await pool.execute('SELECT * FROM `termbases` WHERE `userName` = :userName ORDER by' +
            ' `termbaseName` ASC', {
            userName,
        }) as TermbaseRecordResults;
        return results.map(obj => new TermbaseRecord(obj));
    }

    async add(): Promise<void> {
        await pool.execute(
            'CREATE TABLE :termbaseName (`id` VARCHAR(36) NOT NULL DEFAULT uuid(), `createdAt` DATETIME NOT NULL, `lastModifiedAt` DATETIME NOT NULL, `term` VARCHAR(50) NOT NULL, `termSource` VARCHAR(100) NULL, `termDefinition` VARCHAR(300) NULL, `termDefinitionSource` VARCHAR(100) NULL, `termCollocations` VARCHAR(300) NULL, `equivalent` VARCHAR(50) NOT NULL, `equivalentSource` VARCHAR(100) NULL, `equivalentDefinition` VARCHAR(300) NULL, `equivalentDefinitionSource` VARCHAR(100) NULL, `equivalentCollocations` VARCHAR(300) NULL, PRIMARY KEY (`id`)) COLLATE=utf8mb4_unicode_ci;',
            {
                termbaseName: this.termbaseName,
            });
    }

}