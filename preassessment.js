var { Client } = require('pg');

function allDefined(req){
    if(typeof(req.token) === 'undefined'){
        return false;
    }
    if(typeof(req.score) === 'undefined'){
        return false;
    }
    if(typeof(req.race) === 'undefined'){
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
    
        //TODO: Token is used as userID
        let res = await pgClient.query("SELECT COUNT(score) FROM preassessment WHERE userid = $1 AND race = $2", [req.token, req.race]);
        if(res.rows[0].count > 0){
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Preassessment already uploaded");
            })
        }

        // insert this too as string
        // let now = new Date().toUTCString();

        pgClient.query("INSERT INTO preassessment(userid, score, race, completed) VALUES ($1, $2, $3, $4)", [req.token, req.score, req.race, true])
            .then(res => {
                pgClient.end();
                return new Promise(function(resolve, reject){
                    resolve("Scores successfully uploaded");
                })
            })
            .catch(err => {
                pgClient.end();
                return new Promise(function(resolve, reject){
                    reject(err);
                })
            })

    }
}