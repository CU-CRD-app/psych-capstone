//This file defines functions to create and verify JSON Web Tokens

var jwt = require('jsonwebtoken');
var { Client } = require('pg');

module.exports = {
    verify: async function(token){
        let email = "";
        try{
            let decoded = await jwt.verify(token, process.env.public);
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
            ssl: true,
        });

        pgClient.connect();
        console.log(email)
        let queryRes = await pgClient.query("SELECT userid FROM users WHERE email = $1", [email]);
        console.log(queryRes.rows[0].userid)
        pgClient.end();
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