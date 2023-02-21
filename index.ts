import * as express from 'express';
import * as cors from 'cors';
import 'express-async-errors';
import {userRouter} from "./routers/user-router";
// import './utils/db';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());

// app.use('/terms', termRouter);
app.use('/user', userRouter);

app.listen(3001, 'localhost', () => {
    console.log('Listening on port on http://localhost:3001');
})
