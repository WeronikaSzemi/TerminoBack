import {Router} from "express";
import {compare, hash} from "bcrypt";
import {UserRecord} from "../records/user-record";
import {TermbaseRecord} from "../records/termbase-record";

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