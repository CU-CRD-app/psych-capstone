//This file defines functions to create and verify JSON Web Tokens

var jwt = require('jsonwebtoken');
var { Client } = require('pg');

module.exports = {
    verify: async function(token){
        let public = Buffer.from(process.env.public, 'base64').toString('ascii');
        let email = "";
        try{
            let decoded = await jwt.verify(token, public, {algorithm: 'RS256'});
            if(typeof(decoded) === 'undefined'){
                return new Promise(function(resolve, reject){
                    reject("Invalid token");
                })
            }
            email = decoded.email;
        }
        catch{
            return new Promise(function(resolve, reject){
                reject("Invalid token");
            })
        }

        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                'sslmode': 'require',
                'rejectUnauthorized': false,
            },
        });

        pgClient.connect();
        let queryRes = await pgClient.query("SELECT userid FROM users WHERE email = $1", [email]);
        pgClient.end();
        return new Promise(function(resolve, reject){
            resolve(queryRes.rows[0].userid);
        })
    },

    generate: async function(email){
        let secret = Buffer.from(process.env.secret, 'base64').toString('ascii');
        let token = await jwt.sign({email: email}, secret, {expiresIn:'3h', algorithm:'RS256'})
        return new Promise(function(resolve, reject){
            resolve(token);
        })
    }
}
