import mysql from 'mysql';

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'egmcodedb.czfwn7fjjjxt.us-east-2.rds.amazonaws.com',
    user: process.env.DBUN,
    password: process.env.DBPW,
    port: 3306,
    database: 'auth'
});

export default pool;