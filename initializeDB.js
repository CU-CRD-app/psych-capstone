// This file defines a function to create all the database tables used in the backend, and defines the tables' structures.

var { Client } = require('pg');

module.exports = {
    start: async function(){

        // guard condition
        if(typeof(process.env.DATABASE_URL) === 'undefined'){
            try{
                var auth = require("./auth.json");
                process.env.DATABASE_URL = auth.DATABASE_URL;
            }
            catch{
                return new Promise(function(resolve, reject){
                reject("No database URL found");
            })
            }
            
        }

        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });

        pgClient.connect();

        // users
        res = await pgClient.query("SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='users'");
        if(res.rows[0].count == 0){
            pgClient.query("CREATE TABLE users (userid SERIAL, email TEXT, hashedpassword TEXT, race TEXT, nationality TEXT, gender TEXT, age INT);", (err, res) => {
                if(err){
                    console.log(err);
                    console.log("CRITICAL: Database not intialized");
                }
            })
        }

        // day
        res = await pgClient.query("SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='day'");
        if(res.rows[0].count == 0){
            pgClient.query("CREATE TABLE day (userid INT, level INT, race TEXT, date TEXT, nameface INT, whosnew INT, memory INT, shuffle INT, forcedchoice INT, samedifferent INT);", (err, res) => {
                if(err){
                    console.log(err);
                    console.log("CRITICAL: Database not intialized");
                }
            })
        }

        // preassessment
        res = await pgClient.query("SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='preassessment'");
        if(res.rows[0].count == 0){
            pgClient.query("CREATE TABLE preassessment (userid INT, score INT, race TEXT, date TEXT);", (err, res) => {
                if(err){
                    console.log(err);
                    console.log("CRITICAL: Database not intialized");
                }
            })
        }

        // postassessment
        res = await pgClient.query("SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='postassessment'");
        if(res.rows[0].count == 0){
            pgClient.query("CREATE TABLE postassessment (userid INT, score INT, race TEXT, date TEXT);", (err, res) => {
                if(err){
                    console.log(err);
                    console.log("CRITICAL: Database not intialized");
                }
            })
        }

        pgClient.end();

        return new Promise(function(resolve, reject){
            resolve("Database initialized");
        })
    }
}