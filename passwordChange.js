//This file defines a function allowing a user to change their password

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

function validPassword(pass){
    if(!/[a-z]/.test(pass) || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass) || !pass.indexOf(' ') < 0 || pass.length < 7 || pass.length > 16 || pass == 'Passw0rd' || pass == 'Password123'){
        return false;
    }
    return true;
}

module.exports = {

    getSecurityQuestion: async function(req) {

        if(typeof(req.email) === 'undefined'){
            return new Promise(function(resolve, reject) {
                reject("Invalid request.");
            })
        }
        
        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                'sslmode': 'require',
                'rejectUnauthorized': false,
            },
        });

        await pgClient.connect();

        let result = await pgClient.query('SELECT security_question FROM users WHERE email = $1', [email]);
        if (result.rows.length == 0) {
            pgClient.end();
            return new Promise(function(resolve, reject) {
                reject("Account not found");
            })
        }

        security_question = result.rows[0].security_question_answer;
        return new Promise(function(resolve, reject) {
            resolve(security_question);
        })

    },

    changePassword: async function(req){
        if(typeof(req.email) === 'undefined' ||typeof(req.security_question_answer) === 'undefined'||typeof(req.newpassword) === 'undefined' ){
            return new Promise(function(resolve, reject){
                reject("Invalid new password");
            })
        }

        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                'sslmode': 'require',
                'rejectUnauthorized': false,
            },
        });

        await pgClient.connect();

        let salt = await bcrypt.genSalt((res.rows[0].userid%15)+1);
        let hashedSecurityQuestionAnswer = await bcrypt.hash(req.security_question_answer.toLowerCase(), salt);



        let res = await pgClient.query("SELECT security_question_answer FROM users WHERE email = $1", [req.email.toLowerCase()]);
        if(res.rows.length == 0){
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Account not found");
            })
        }

        let match = await bcrypt.compare(hashedSecurityQuestionAnswer, res.rows[0].security_question_answer);

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
                console.log(err)
                pgClient.end();
                return new Promise(function(resolve, reject){
                    reject(err);
                })
            })
        }
        else{
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Security question answer does not match.");
            })
        }

    },

    update: async function(req){
        if(!allDefined(req)){
            return new Promise(function(resolve, reject){
                reject("Missing parameter");
            })
        }

        if(!validPassword(req.newpassword)){
            return new Promise(function(resolve, reject){
                reject("Invalid new password");
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
                console.log(err)
                pgClient.end();
                return new Promise(function(resolve, reject){
                    reject(err);
                })
            })
        }
        else{
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Password does not match");
            })
        }

    }
}