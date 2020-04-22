var { Client } = require('pg');

function allDefined(req){
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
        let dayCount = await pgClient.query("SELECT count(date) FROM day WHERE userid = $1 AND level = $2", [req.token, req.level]);

        if(dayCount.rows[0].count > 0){
            //Guard condition, prevents the same level from being uploaded twice for a given user
            //NOTE: Could cause issue if there is an error further down.  Need to consider
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Level already uploaded");
            })
        }

        let now = new Date();

        let values = [req.token, req.level, req.race, req.completed, now, req.nameface, req.whosnew, req.memory, req.shuffle, req.forcedchoice, req.samedifferent];

        pgClient.query("INSERT INTO day (userid, level, race, date, nameface, whosnew, memory, shuffle, forcedchoice, samedifferent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", values)
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