// This file defines a function to create all the database tables used in the backend, and defines the tables' structures.

var { Client } = require('pg');

// In this list we have a list of tables to check and then optionally create.
// Structure is: [TABLE, CHECK, CREATE].
// All of these checks require just seeing if the query returned more than zero rows.
const tables = [
    [
        "users",
        "SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='users'",
        "CREATE TABLE users (userid SERIAL, username TEXT, email TEXT, hashedpassword TEXT, race TEXT, nationality TEXT, gender TEXT, age INT);",
    ],
    [
        "day",
        "SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='day'",
        "CREATE TABLE day (userid INT, level INT, race TEXT, date TEXT, nameface INT, whosnew INT, memory INT, shuffle INT, forcedchoice INT, samedifferent INT);",
    ],
    [
        "preassessment",
        "SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='preassessment'",
        "CREATE TABLE preassessment (userid INT, score INT, race TEXT, date TEXT);",
    ],
    [
        "postassessment",
        "SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='postassessment'",
        "CREATE TABLE postassessment (userid INT, score INT, race TEXT, date TEXT);",
    ],  
    //Holds achievements belonging to each user, only one row with same achievement title per user ensures no duplicate achievements
    [
        "achievements",
        "SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='achievements'",
        `CREATE TABLE 
        achievements 
        (userid INT, 
        achievement_title TEXT,
        achievement_description TEXT NOT NULL,
        PRIMARY KEY(achievement_title, userid)
        )`
    ],

];

module.exports = {
    start: async function(){

        async function successHappened() {
            return new Promise((resolve, reject) => {resolve("Database initialized")});
        }

        async function errorHappened(e) {
            console.log(e);
            console.log("CRITICAL: Database not initialized!");
            return new Promise((resolve, reject) => {reject(e)});
        }

        // guard condition
        if(typeof(process.env.DATABASE_URL) === 'undefined'){
            try{
                const auth = require("./auth.json");
                process.env.DATABASE_URL = auth.DATABASE_URL;
            }
            catch{
                return new Promise(
                    (resolve, reject) => {reject("No database URL found")}
                );
            }
            
        }

        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                'sslmode': 'require',
                'rejectUnauthorized': false,
            },

        });

        await pgClient.connect();

        var tableInfoArr, name, checkQuery, createQuery, res;
        for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
            tableInfoArr = tables[tableIndex];
            name = tableInfoArr[0];
            checkQuery = tableInfoArr[1];
            createQuery = tableInfoArr[2];

            res = await pgClient.query(checkQuery);
            if (res.rows[0].count == 0) {
                try {
                    await pgClient.query(createQuery);
                    console.log(`${name} table created`);
                }
                catch (e) {
                    console.log(`Unable to create table ${name}`);
                    return errorHappened(e);
                }
            }

        }

        pgClient.end()
        return successHappened();
    }
}
