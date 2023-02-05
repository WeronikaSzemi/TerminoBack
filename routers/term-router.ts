import {Router} from "express";
import {TermRecord} from "../records/term-record";
import {ValidationError} from "../utils/error";
import {TermEntity} from "../types";

export const termRouter = Router();

termRouter
    .get('/', async (req, res) => {
        const termsList = await TermRecord.getAll();

        res.json({
            termsList,
        });
    })

    .get('/:id', async (req, res) => {
        const entry = await TermRecord.getOne(req.params.id);
        res.json({
            entry,
        });
    })

    .post('/', async (req, res) => {
        const newTerm = new TermRecord(req.body);

        await newTerm.add();

        res.redirect('/terms');
    })

    .put('/:id', async (req, res) => {
        const term = await TermRecord.getOne(req.params.id);

        if (!term) {
            throw new ValidationError("Nie ma takiego terminu.");
        }

        const data: TermEntity = req.body;
        await term.edit(data);

        res.end();
    })

    .delete('/:id', async (req, res) => {
        const term = await TermRecord.getOne(req.params.id);

        if (!term) {
            throw new ValidationError("Nie ma takiego terminu.");
        }

        await term.delete();

        res.end();
    })
