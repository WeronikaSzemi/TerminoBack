import {Router} from "express";
import {compare, hash} from "bcrypt";
import {UserRecord} from "../records/user-record";
import {TermbaseRecord} from "../records/termbase-record";
import {TermRecord} from "../records/term-record";
import {ValidationError} from "../utils/error";
import {TermEntity} from "../types";

export const userRouter = Router();

userRouter
    .post('/', async (req, res) => {

        hash(req.body.password, 10, (err, hash) => {
            if (err) {
                console.error(err);
            } else {
                const newUser = new UserRecord({
                    ...req.body,
                    hash,
                });
                newUser.add();
            }
        });
    })

    .get('/login/:userName', async (req, res) => {
        const userRecord = await UserRecord.getOne(req.params.userName);

        !userRecord
            ? res.json(false)
            : res.json(true)
    })

    .post('/login/:userName', async (req, res) => {

        const userName = req.params.userName;
        const userRecord = await UserRecord.getOne(userName);
        const {password} = req.body;

        compare(password, userRecord.hash, (err, result) => {
            res
                .json({
                    result,
                    userName,
                    // })
                    //     .cookie('username', `${userName}`, {
                    //         domain: 'localhost:3000',
                    //         httpOnly: true,
                    //         // secure: true, @TODO: do włączenia po przeniesieniu na serwer
                });
        });
    })

    .get('/:userName/account', async (req, res) => {

    })

    .get('/:userName/termbases', async (req, res) => {
        const termbaseList = await UserRecord.getTermbaseList(req.params.userName);
        res.json({
            termbaseList,
        });
    })

    .post('/:userName/termbases', async (req, res) => {
        const newTermbase = new TermbaseRecord(req.body);

        await newTermbase.add();
        res.json(newTermbase);
    })

    .delete('/:userName/termbases/:termbaseName', async (req, res) => {
        const fullTermbaseName = `${req.params.userName}_${req.params.termbaseName}`;

        await TermbaseRecord.drop(fullTermbaseName);
        //     @TODO: obsługa błędu: brak słownika w bazie
    })

    .get('/:userName/termbases/:termbaseName', async (req, res) => {
        const termsList = await TermRecord.getAll(req.params.userName, req.params.termbaseName);

        res.json({
            termsList,
        });
    })

    .post('/:userName/termbases/:termbaseName', async (req, res) => {
        const newTerm = new TermRecord(req.body);
        await newTerm.add(req.params.userName, req.params.termbaseName);
        res.end();
    })

    .get('/:userName/termbases/:termbaseName/:id', async (req, res) => {
        const entry = await TermRecord.getOne(req.params.userName, req.params.termbaseName, req.params.id);
        res.json({
            entry,
        });
    })

    .put('/:userName/termbases/:termbaseName/:id', async (req, res) => {
        const term = await TermRecord.getOne(req.params.userName, req.params.termbaseName, req.params.id);

        if (!term) {
            throw new ValidationError("Nie ma takiego hasła.");
        }

        const data: TermEntity = req.body;
        await term.edit(req.params.userName, req.params.termbaseName, data);

        res.end();
    })

    .delete('/:userName/termbases/:termbaseName/:id', async (req, res) => {
        const term = await TermRecord.getOne(req.params.userName, req.params.termbaseName, req.params.id);

        if (!term) {
            throw new ValidationError("Nie ma takiego hasła.");
        }

        await term.delete(req.params.userName, req.params.termbaseName);

        res.end();
    })