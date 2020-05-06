var jwt = require('jsonwebtoken');
var { Client } = require('pg');

module.exports = {
    verify: async function(token){
        let email = "";
        try{
            let decoded = await jwt.verify(token, process.env.public);
            email = decoded.email;
        }
        catch(err){
            return new Promise(function(resolve, reject){
                reject(err);
            })
        }

        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });

        pgClient.connect();
        let queryRes = await pgClient.query("SELECT userid FROM users WHERE email = $1", [email]);
        return new Promise(function(resolve, reject){
            resolve(queryRes.rows[0].userid);
        })
    },

    generate: async function(email){
        let token = await jwt.sign({email: email}, process.env.secret, {expiresIn:'3h', algorithm:'RS256'})
        return new Promise(function(resolve, reject){
            resolve(token);
        })
    }
}