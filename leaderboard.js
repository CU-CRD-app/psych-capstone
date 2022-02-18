const { Client } = require('pg');

module.exports = {
    getHiscores: async function(gamemode) {

        try {
            const pgClient = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    'sslmode': 'require',
                    'rejectUnauthorized': false,
                },
            });

            const validGamemodes = ["nameface", "whosnew","memory", "shuffle","forcedchoice", "samedifferent"];
            if (!validGamemodes.includes(gamemode)) {
                throw new Error("Invalid gamemode.")
            }
            const gamemodeColumn = "day." + gamemode;
            const getHiscoresQuery = "SELECT users.email, " + gamemodeColumn + " FROM users, day WHERE day.userid = users.userid AND " + gamemodeColumn + " >= 0 ORDER BY " + gamemodeColumn + " DESC";

            await pgClient.connect()
            console.log("Fetching hiscores for: " + gamemode);
            let hiscores = await pgClient.query(getHiscoresQuery);
            let results = []
            for (let i = 0; i < hiscores.rows.length; i++) {
                const currRow = hiscores.rows[i]
                results.push({email:currRow["email"], score:currRow[gamemode]});
            }
            return new Promise(function(resolve, reject) {
                resolve(results);
            })
        } catch (err) {
            console.log(err);
            return new Promise(function(resolve, reject) {
                reject(err);
            })

        } finally {
            if (typeof pgClient !== 'undefined') {
                await pgClient.end();
            }
        }
    }
}