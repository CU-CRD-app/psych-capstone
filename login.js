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
        let res = await pgClient.query("SELECT * FROM users WHERE email = $1 AND hashedpassword = $2", [req.email.toLowerCase(), req.password]);
        if(res.rows.length == 0){
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Account not found");
            })
        }

        pgClient.end();
        //TODO: implement token
        let sendObject = {
            token: res.rows[0].userid
        }

        return new Promise(function(resolve, reject){
            resolve(sendObject);
        })
    }
}