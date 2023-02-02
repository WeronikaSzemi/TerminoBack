import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/error";

type UserRecordResults = [UserRecord[], FieldPacket[]];

export class UserRecord {
    id?: string;
    private readonly userName: string;
    private readonly password: string;
    private loggedIn = false;
    private termbases: string[];

    constructor(obj: UserRecord) {
        const {id, userName, password, termbases} = obj;
    }

    async add(obj: UserRecord): Promise<void> {
        await pool.execute('INSERT into `users`(`id`, `userName`, `password`, `termbases`) VALUES(:id, :userName,' +
            ' :password, :termbases)', {
            id: this.id,
            userName: this.userName,
            password: this.password,
            termbases: this.termbases,
        });
    }

    async login(userName: string, password: string): Promise<void> {
        const [results] = await pool.execute('SELECT * FROM `users` WHERE `userName` = :userName', {
            userName,
        }) as UserRecordResults;

        if (results.length === 0) {
            throw new ValidationError('Nie zarejestrowano użytkownika_czki o takiej nazwie.');
        } else {
            const user = new UserRecord(results[0]);
            if (user.password !== password) {
                throw new ValidationError('Podane hasło jest nieprawidłowe.');
            } else {
                this.loggedIn = true;
            }
        }
    }

    async delete(id: string): Promise<number> {

        if (!this.id) {
            throw new ValidationError('Brakuje ID uzytkownika_czki.');
        }

        const answer = await pool.execute('DELETE * FROM `users` WHERE `id` = :id', {
            id,
        });
        return (JSON.parse(JSON.stringify(answer)))[0].affectedRows;
    }

    async getTermbaseList() {

    }
}