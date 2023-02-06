import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/error";

type UserRecordResults = [UserRecord[], FieldPacket[]];

export class UserRecord {
    userId?: string;
    private readonly userName: string;
    private hash: string;

    constructor(obj: UserRecord) {
        const {userId, userName, hash} = obj;

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

        this.userId = userId ?? uuid();
        this.userName = userName;
        this.hash = hash;
    }

    async add(): Promise<void> {
        await pool.execute('INSERT into `users`(`userId`, `userName`, `hash`) VALUES(:userId, :userName, :hash)', {
            userId: this.userId,
            userName: this.userName,
            hash: this.hash,
        });
    }

    // async getOne(userName: string): Promise<void> {
    //     const [results] = await pool.execute('SELECT * FROM `users` WHERE `userName` = :userName', {
    //         userName,
    //     }) as UserRecordResults;
    //
    //
    // }

    // async login(userName: string, hash: string): Promise<void> {
    //     const [results] = await pool.execute('SELECT * FROM `users` WHERE `userName` = :userName', {
    //         userName,
    //     }) as UserRecordResults;
    //
    //     if (results.length === 0) {
    //         throw new ValidationError('Nie zarejestrowano użytkownika_czki o takiej nazwie.');
    //     } else {
    //         const user = new UserRecord(results[0]);
    //         if (user.hash !== hash) {
    //             throw new ValidationError('Podane hasło jest nieprawidłowe.');
    //         } else {
    //             this.loggedIn = true;
    //         }
    //     }
    // }

    async delete(userId: string): Promise<number> {

        if (!this.userId) {
            throw new ValidationError('Brakuje ID użytkownika_czki.');
        }

        const answer = await pool.execute('DELETE * FROM `users` WHERE `userId` = :userId', {
            userId,
        });
        return (JSON.parse(JSON.stringify(answer)))[0].affectedRows;
    }

    async getTermbaseList() {

    }
}