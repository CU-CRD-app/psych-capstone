var { Client } = require('pg');

module.exports = {
    confirm: async function(key){
        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });

        pgClient.connect();

        let res = await pgClient.query("SELECT * FROM confirmation WHERE key = $1", [key]);
        if(res.rows.length == 0){
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Key not found");
            })
        }

        let now = new Date();

        let generation = new Date(res.rows[0].date);

        let diff = Math.abs(now-generation); //difference in milliseconds

        if(diff > 86400000){
            //Setting email to confirmed
            return new Promise(function(resolve, reject){
                resolve("Email confirmed!");
            })
        }
        else{
            await pgClient.query("DELETE FROM confirmation WHERE key = $1", [key]);
            return new Promise(function(resolve, reject){
                reject("Expired, sending new email");
            })
        }
    }
}