var { Client } = require('pg');

allDefined = function(req){
    if(typeof(req.level) === 'undefined'){
        return false;
    }
    if(typeof(req.race) === 'undefined'){
        return false;
    }
    if(typeof(req.token) === 'undefined'){
        return false;
    }
    if(typeof(req.shuffle) === 'undefined'){
        return false;
    }
    if(typeof(req.memory) === 'undefined'){
        return false;
    }
    if(typeof(req.whosnew) === 'undefined'){
        return false;
    }
    if(typeof(req.nameface) === 'undefined'){
        return false;
    }
    if(typeof(req.forcedchoice) === 'undefined'){
        return false;
    }
    if(typeof(req.samedifferent) === 'undefined'){
        return false;
    }
    return true;
}

module.exports = {
    upload: async function(req){
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

        //TODO: Token is used directly as userid throughout this file, needs to change when token is properly implemented
        let dayCount = pgClient.query("SELECT count(date) FROM day WHERE userid = $1 AND level = $2", [req.token, req.level]);

        if(dayCount.rows[0].count > 0){
            //Guard condition, prevents the same level from being uploaded twice for a given user
            //NOTE: Could cause issue if there is an error further down.  Need to consider
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Level already uploaded");
            })
        }

        let now = new Date();

        //TODO: Do we need completed if we are uploading all tasks at once when the day is completed?
        pgClient.query("INSERT INTO day (userid, level, race, completed, date) VALUES ($1, $2, $3, $4, $5)", [req.token, req.level, req.race, true, now])
            .catch(err => {
                pgClient.end();
                return new Promise(function(resolve, reject){
                    reject(err);
                })
            })


        //Training Tasks: (matches order displayed in app)
        //1: nameface
        //2: who's new
        //3: memory
        //4: shuffle

        pgClient.query("INSERT INTO trainingtask (userid, level, race, taskid, score) VALUES ($1, $2, $3, $4, $5)", [req.token, req.level, req.race, 1, req.nameface])
        .catch(err => {
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject(err);
            })
        })

        pgClient.query("INSERT INTO trainingtask (userid, level, race, taskid, score) VALUES ($1, $2, $3, $4, $5)", [req.token, req.level, req.race, 2, req.whosnew])
        .catch(err => {
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject(err);
            })
        })

        pgClient.query("INSERT INTO trainingtask (userid, level, race, taskid, score) VALUES ($1, $2, $3, $4, $5)", [req.token, req.level, req.race, 3, req.memory])
        .catch(err => {
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject(err);
            })
        })

        pgClient.query("INSERT INTO trainingtask (userid, level, race, taskid, score) VALUES ($1, $2, $3, $4, $5)", [req.token, req.level, req.race, 4, req.shuffle])
        .catch(err => {
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject(err);
            })
        })

        //Assessment tasks:
        //1: Forced choice
        //2: Same different
        
        pgClient.query("INSERT INTO assessmenttask (userid, level, race, score) VALUES ($1, $2, $3, $4)", [req.token, req.level, req.race, req.forcedchoice])
        .catch(err => {
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject(err);
            })
        })

        pgClient.end();
        return new Promise(function(resolve, reject){
            resolve("Tasks successfully uploaded");
        })
    }
}