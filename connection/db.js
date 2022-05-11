import pkg from 'pg';

const {
    Pool
} = pkg;
export const pool = new Pool({
    database: 'b34s_chapter2',
    user: 'postgres',
    port: 5432,
    password: 'yadiprime009'
});