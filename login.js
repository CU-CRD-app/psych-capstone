var { Client } = require('pg');

allDefined = function(req){
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

        //TODO: sort?
        let resDays = await pgClient.query("SELECT * FROM day WHERE userid = $1", [res.rows[0].userid]);
    
        let preCount = await pgClient.query("SELECT count(score) FROM preassessment WHERE userid = $1", [res.rows[0].userid]);

        let postCount = await pgClient.query("SELECT count(score) FROM postassessment WHERE userid = $1", [res.rows[0].userid]);

        let level = resDays.rows.length + preCount.rows[0].count + postCount.rows[0].count;

        pgClient.end();
        //TODO: implement token
        let sendObject = {
            days: resDays.rows,
            token: res.rows[0].userid,
            level: level
        }

        return new Promise(function(resolve, reject){
            resolve(sendObject);
        })
    }
}