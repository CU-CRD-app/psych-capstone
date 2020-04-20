var { Client } = require('pg');

allDefined = function(req){
    if(typeof(req.email) === 'undefined'){
        return false;
    }
    if(typeof(req.password) === 'undefined'){
        return false;
    }
    if(typeof(req.race) === 'undefined'){
        return false;
    }
    if(typeof(req.nationality) === 'undefined'){
        return false;
    }
    if(typeof(req.gender) === 'undefined'){
        return false;
    }
    if(typeof(req.age) === 'undefined'){
        return false;
    }
    return true;
}

module.exports = {
    user: async function(req){
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

        let res = await pgClient.query("SELECT COUNT(email) FROM users WHERE email = $1", [req.email]);
        if(res.rows[0].count > 0){
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Email already used");
            })
        }

        //TODO: input validation, password hashing, convert email to all lower case?
        pgClient.query("INSERT INTO users(userid, email, hashedpassword, race, nationality, gender, age) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)", [req.email, req.password, req.race, req.nationality, req.gender, req.age])
            .then(res => {
                pgClient.end();
                return new Promise(function(resolve, reject){
                    resolve(req.email+" successfully registered!");
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