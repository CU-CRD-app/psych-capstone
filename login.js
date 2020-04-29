var { Client } = require('pg');

function allDefined(req){
    if(typeof(req.email) === 'undefined'){
        return false;
    }
    if(typeof(req.password) === 'undefined'){
        return false;
    }
    return true;
}

module.exports = {
    login: async function(req){
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

        //TODO: password hashing
        let res = await pgClient.query("SELECT * FROM users WHERE email = $1 AND hashedpassword = $2", [req.email, req.password]);
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

        if (resDays.rows[resDays.rows.length - 1][nameface] > -1 || resDays.rows[resDays.rows.length - 1][whosnew] > -1 || resDays.rows[resDays.rows.length - 1][memory] > -1 || resDays.rows[resDays.rows.length - 1][shuffle] > -1 || resDays.rows[resDays.rows.length - 1][forcedchoice] > -1 || resDays.rows[resDays.rows.length - 1][samedifferent] > -1) {
            level--;
        }

        // make these a dict or array to also pass the date
        let preScore = 0;
        let postScore = 0;

        if(preCount.rows.length > 0){
            preScore = preCount.rows[0].score;
        }

        if(postCount.rows.length > 0){
            postScore = postCount.rows[0].score;
        }

        pgClient.end();
        //TODO: implement token
        let sendObject = {
            days: resDays.rows,
            token: res.rows[0].userid,
            level: level,
            pre: preScore,
            post: postScore
        }

        return new Promise(function(resolve, reject){
            resolve(sendObject);
        })
    }
}