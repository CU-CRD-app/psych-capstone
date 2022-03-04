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

            const validGamemodes = ["nameface", "whosnew","memory", "shuffle", "all"];
            if (!validGamemodes.includes(gamemode)) {
                throw new Error("Invalid gamemode.")
            }
            let gamemodeColumn = "";
            let getHiscoresQuery = "";
            if (gamemode !== "all") {
                const gamemodeColumn = "day." + gamemode;
                const getHiscoresQuery = "SELECT users.username, " + gamemodeColumn + " FROM users, day WHERE day.userid = users.userid AND " + gamemodeColumn + " >= 0 ORDER BY " + gamemodeColumn + " DESC";
            } else {
                getHiscoresQuery = "select users.username, GREATEST(day.nameface, day.whosnew, day.shuffle,day.memory) as max_score FROM users, day WHERE day.userid = users.userid ORDER BY max_score DESC";
            }

            await pgClient.connect()
            console.log("Fetching hiscores for: " + gamemode);
            let hiscores = await pgClient.query(getHiscoresQuery);
            let results = []
            for (let i = 0; i < hiscores.rows.length; i++) {
                const currRow = hiscores.rows[i]
                const username = (currRow["username"] === null) ? "Unknown" : currRow["username"];
                const score = (gamemode === "all") ? currRow["max_score"] : currRow[gamemode];
                if (score >= 0) {
                    results.push({username:username, score:score});
                }
            }
            return new Promise(function(resolve, reject) {
                console.log(results);
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