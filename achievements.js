const token = require("./token")
const { Client } = require('pg');
const { achievementTitles, achievementDescriptions } = require("./achievementConstants");
const { verify } = require("./token");


module.exports = {

    /*
        Call this function elsewhere in backend to give a user an achievement where appropriate
        For example, after a user completes training,
        you've found that this is the second day in a row they've done training
        you would then call this function to issue them the "TWO_DAYS_IN_A_ROW" achievement

        Args: 
            userid: id of user being issued the achievement
            achievement_title_key: Key of the achievement title being issued
                (valid ones found in the maps in achievementConstants.js)
    */ 
    addAchievement: async function(userid, achievement_title_key) {

        try {

            if (!(achievement_title_key in achievementTitles) || !(achievement_title_key in achievementDescriptions)) {
                throw new Error("Invalid achievement title.");
            }

            const achievementTitle = achievementTitles[achievement_title_key];
            const achievementDescription = achievementDescriptions[achievement_title_key];

            const pgClient = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    'sslmode': 'require',
                    'rejectUnauthorized': false,
                },
            });
    
           await pgClient.connect();
    
            await pgClient.query(
                `INSERT INTO achievements(userid, achievement_title,achievement_description)
                VALUES ($1, $2, $3)`, 
            [userid, achievementTitle, achievementDescription]);

            await pgClient.end();

            return Promise.resolve("Successfully added achievement!");

        } catch (err) {
            console.log(err);
            await pgClient.end();
            return Promise.reject("Failed to add achievement.");
        }
    },

    getAchievements: async function(userid) {
        try {

            const pgClient = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    'sslmode': 'require',
                    'rejectUnauthorized': false,
                },
            });
    
            await pgClient.connect();
    
            let res = await pgClient.query("SELECT * FROM achievements WHERE userid = $1", [userid])
            await pgClient.end();
            return Promise.resolve(res.rows);

        } catch (err) {
            console.log(err);
            return Promise.resolve("An error occurred fetching achievements.");
        }
    },

    getConsecutiveDaysPlayed: async function(userid) {

        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                'sslmode': 'require',
                'rejectUnauthorized': false,
            },
        });

        await pgClient.connect();
        let test = await pgClient.query("SELECT * from users");
        console.log(test.rows.length);

        //Get unique dates played in last 5 days for userid
        return pgClient.query(
            `SELECT to_date(date, 'Dy, DD Mon YYYY') as converted_date 
            FROM day 
            WHERE to_date(date, 'Dy, DD Mon YYYY') >= current_date - interval '5 day' 
            AND date != '-1' 
            AND userid = $1
            GROUP BY converted_date
            ORDER BY converted_date DESC`, [userid])
        .then(res => {
            const oneDay = 24 * 60 * 60 * 1000;
            let recent_dates_played = res.rows.map(row => new Date(row.converted_date));
            let consecutive_days = 1;
            for (let i = 1; i < recent_dates_played.length; i++) {
                let curr_date = recent_dates_played[i];
                let prev_date = recent_dates_played[i-1];
                const diffDays = Math.round(Math.abs((curr_date- prev_date) / oneDay));
                if (diffDays > 1) {
                    break;
                } else {
                    consecutive_days++;
                }
            }
            pgClient.end();
            return consecutive_days;
            
        })
        .catch(err => {
            console.log(err);
            pgClient.end();
        }) 
    }
}