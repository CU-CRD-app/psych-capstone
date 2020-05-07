var { Client } = require('pg');
var bcrypt = require('bcryptjs');

function allDefined(req){
    if(typeof(req.email) === 'undefined'){
        return false;
    }
    if(typeof(req.oldpassword) === 'undefined'){
        return false;
    }
    if(typeof(req.newpassword) === 'undefined'){
        return false;
    }
    return true;
}

module.exports = {
    update: async function(req){
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

        let res = await pgClient.query("SELECT * FROM users WHERE email = $1", [req.email.toLowerCase()]);
        if(res.rows.length == 0){
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Account not found");
            })
        }

        let match = await bcrypt.compare(req.oldpassword, res.rows[0].hashedpassword);

        if(match){
            let salt = await bcrypt.genSalt((res.rows[0].userid%15)+1);
            let newHashedPassword = await bcrypt.hash(req.newpassword, salt);
            pgClient.query("UPDATE users SET hashedpassword = $1 WHERE email = $2", [newHashedPassword, req.email.toLowerCase()])
            .then(res => {
                pgClient.end();
                return new Promise(function(resolve, reject){
                    resolve("Password changed"); //NOTE: Return value doesn't seem to be passing right now.  May need to use another await?
                })
            })
            .catch(err => {
                pgClient.end();
                return new Promise(function(resolve, reject){
                    reject(err);
                })
            })
        }
        else{
            return new Promise(function(resolve, reject){
                reject("Password does not match");
            })
        }

    }
}