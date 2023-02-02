import {createPool} from 'mysql2/promise';

export const pool = createPool({
    host: 'localhost',
    user: 'root',
    database: 'termino',
    namedPlaceholders: true,
    decimalNumbers: true,
});