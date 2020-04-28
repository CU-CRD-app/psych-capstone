var { Client } = require('pg');

function allDefined(req){
    if(typeof(req.token) === 'undefined'){
        return false;
    }
    return true;
}

module.exports = {
    userData: async function(req){
        if(!allDefined(req)){
            return new Promise(function(resolve, reject){
                reject("Missing parameter");
            })
        }

        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });

        pgClient.connect();

        //TODO: Query will need to be updated to use the email associated with the token, not just the token as the email
        let res = await pgClient.query("SELECT * FROM users WHERE email = $1", [req.token]);
        if(res.rows.length == 0){
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Account not found");
            })
        }

        //TODO: Only supports one race, changes will need to be support other races
        let resDays = await pgClient.query("SELECT * FROM day WHERE userid = $1", [res.rows[0].userid]);
    
        let preCount = await pgClient.query("SELECT * FROM preassessment WHERE userid = $1", [res.rows[0].userid]);

        let postCount = await pgClient.query("SELECT * FROM postassessment WHERE userid = $1", [res.rows[0].userid]);

        let level = resDays.rows.length + preCount.rows.length + postCount.rows.length;

        if (resDays.rows[resDays.rows.length - 1].indexOf(-1) > -1) {
            level--;
        }

        //TODO: Update this to match login return when pre and post assessment dates are returned
        let preScore = 0;
        let postScore = 0;

        if(preCount.rows.length > 0){
            preScore = preCount.rows[0].score;
        }

        if(postCount.rows.length > 0){
            postScore = postCount.rows[0].score;
        }

        pgClient.end();

        let sendObject = {
            days: resDays.rows,
            level: level,
            pre: preScore,
            post: postScore
        }

        return new Promise(function(resolve, reject){
            resolve(sendObject);
        })
    }
}