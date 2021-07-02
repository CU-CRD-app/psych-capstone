// This file defines functions to return a user's level and scores from the database

var { Client } = require('pg');

function allDefined(id){
    if(typeof(id) === 'undefined'){
        return false;
    }
    return true;
}

module.exports = {
    userData: async function(id){
        if(!allDefined(id)){
            return new Promise(function(resolve, reject){
                reject("Missing parameter");
            })
        }

        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });

        pgClient.connect();

        let res = await pgClient.query("SELECT * FROM users WHERE userid = $1", [id]);
        if(res.rows.length == 0){
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Account not found");
            })
        }

        let resDays = await pgClient.query("SELECT * FROM day WHERE userid = $1", [res.rows[0].userid]);  //and level != -1
    
        let preCount = await pgClient.query("SELECT * FROM preassessment WHERE userid = $1", [res.rows[0].userid]);

        let postCount = await pgClient.query("SELECT * FROM postassessment WHERE userid = $1", [res.rows[0].userid]);

        let raceName = await pgClient.query("select race from day where userid = $1 and level = $2", [res.rows[0].userid, -1]);

        let level = resDays.rows.length + preCount.rows.length + postCount.rows.length;

        if (preCount.rows.length == 0) {
            level = 0;
        } else {
            for (var i = 0; i < resDays.rows.length; i++) {
                if (resDays.rows[i]['nameface'] == -1 || resDays.rows[i]['whosnew'] == -1 || resDays.rows[i]['memory'] == -1 || resDays.rows[i]['shuffle'] == -1 || resDays.rows[i]['forcedchoice'] == -1 || resDays.rows[i]['samedifferent'] == -1) {
                    level = i + 1;
                    break;
                }
            }
        }

        let preAssessment = {};
        let postAssessment= {};
        // let raceName = preCount.rows[0].race;

        if(preCount.rows.length > 0){
            preAssessment['score'] = preCount.rows[0].score;
            preAssessment['date'] = preCount.rows[0].date;
        }

        if(postCount.rows.length > 0){
            postAssessment['score'] = postCount.rows[0].score;
            postAssessment['date'] = postCount.rows[0].date;
        }

        pgClient.end();

        let sendObject = {
            days: resDays.rows,
            race: raceName.rows[0].race,
            level: level,
            pre: preAssessment,
            post: postAssessment
        }

        return new Promise(function(resolve, reject){
            resolve(sendObject);
        })
    }
}