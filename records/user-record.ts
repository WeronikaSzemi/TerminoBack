import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/error";
import {UserEntity} from "../types";
import {TermbaseRecord, TermbaseRecordResults} from "./termbase-record";

type UserRecordResults = [UserRecord[], FieldPacket[]];

export class UserRecord implements UserEntity {
    readonly userName: string;
    hash: string;

    constructor(obj: UserEntity) {
        const {userName, hash} = obj;

        if (userName === '') {
            throw new ValidationError(`Nazwa użytkownika nie może być pustym tekstem.`)
        }
        if (userName.length < 5) {
            throw new ValidationError(
                `Nazwa użytkownika musi składać się z co najmniej pięciu znaków. Aktualnie zawiera ich ${userName.length}.`);
        }
        if (userName.length > 30) {
            throw new ValidationError(
                `Nazwa użytkownika może składać się z maksymalnie 30 znaków. Aktualnie zawiera ich ${userName.length}.`);
        }

        this.userName = userName;
        this.hash = hash;
    }

    static async getTermbaseList(userName: string) {
        if (!userName) {
            throw new ValidationError('Brakuje nazwy użytkownika_czki.');
        }

        const [answer] = await pool.execute(
            'SELECT * FROM `termbases` WHERE `userName` = :userName ORDER by `termbaseName` ASC', {
                userName,
            }) as TermbaseRecordResults;
        const results = answer.map(record => {
            return {
                ...record,
                termbaseName: record.termbaseName.slice(userName.length + 1),
            };
        });
        return results.map(obj => new TermbaseRecord(obj));
    }

    static async getOne(userName: string): Promise<UserRecord> {
        if (!userName) {
            throw new ValidationError('Nie podano nazwy użytkownika_czki.');
        }

        const [results] = await pool.execute('SELECT * FROM `users` WHERE `userName` = :userName', {
            userName,
        }) as UserRecordResults;

        return results.length === 0 ? null : new UserRecord(results[0]);

        // if (results.length === 0) {
        //     throw new ValidationError('Nie ma użytkownika_czki o takiej nazwie.');
        // } else if (results[0].hash !== hash) {
        //     throw new ValidationError('Podane hasło jest nieprawidłowe.');
        // } else {
        //     return new UserRecord(results[0]);
        // }
    }

    async add(): Promise<void> {
        const [results] = await pool.execute('SELECT * FROM `users` WHERE `userName` = :userName', {
            userName: this.userName,
        }) as UserRecordResults;

        if (results.length === 0) {
            await pool.execute('INSERT into `users`(`userName`, `hash`) VALUES(:userName, :hash)', {
                userName: this.userName,
                hash: this.hash,
            });
        } else {
            throw new ValidationError('Nazwa jest już zajęta. Wybierz inną.');
        }
    }

    async delete(userName: string) {

        if (!this.userName) {
            throw new ValidationError('Brakuje nazwy użytkownika_czki.');
        }

        await pool.execute('DELETE * FROM `users` WHERE `userName` = :userName', {
            userName,
        });
    };
}