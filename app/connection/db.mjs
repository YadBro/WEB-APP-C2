import pkg from "pg";


const { Pool } = pkg;

// Setup connection pool
export const dbPool = new Pool({
    database: 'b34s_chapter2',
    port: 5432,
    user: 'postgres',
    password: 'yadiprime009'
});
