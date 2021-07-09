// This file defines functions to create a new user in a database, and hashes their passwords

var { Client } = require('pg');
var bcrypt = require('bcryptjs');

function allDefined(req){
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
    if(typeof(req.agree) === 'undefined'){
        return false;
    }
    return true;
}

function allValid(req){
    var nationList = ["United States of America (USA)", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic (CAR)", "Chad", "Chile", "China", "Colombia", "Comoros", "Democratic Republic of the Congo", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates (UAE)", "United Kingdom (UK)", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
    var genderList = ["Male", "Female", "Other"];
    var raceList = ["Caucasian", "Black", "Hispanic", "East Asian", "South Asian", "Middle Eastern", "Pacific Islander", "American Indian/Alaska Native", "Other"]

    if(!/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(req.email.toLowerCase())){
        return false;
    }
    if(!/[a-z]/.test(req.password) || !/[A-Z]/.test(req.password) || !/[0-9]/.test(req.password) || !req.password.indexOf(' ') < 0 || req.password.length < 7 || req.password.length > 16 || req.password == 'Passw0rd' || req.password == 'Password123'){
        return false;
    }
    if(raceList.indexOf(req.race) < 0){
        return false;
    }
    if(nationList.indexOf(req.nationality) < 0){
        return false;
    }
    if(genderList.indexOf(req.gender) < 0){
        return false;
    }
    if(req.age < 18 || req.age > 100){
        return false;
    }
    if(req.agree != true){
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
        if(!allValid(req)){
            return new Promise(function(resolve, reject){
                reject("Invalid parameters");
            })
        }
        const pgClient = new Client({
            connectionString: process.env.DATABASE_URL,
            ssl: true,
        });

        pgClient.connect();

        let res = await pgClient.query("SELECT COUNT(email) FROM users WHERE email = $1", [req.email.toLowerCase()]);
        if(res.rows[0].count > 0){
            pgClient.end();
            return new Promise(function(resolve, reject){
                reject("Email already used");
            })
        }

        await pgClient.query("INSERT INTO users(userid, email, hashedpassword, race, nationality, gender, age) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)", [req.email.toLowerCase(), null, req.race, req.nationality, req.gender, req.age])
        
        let updated = await pgClient.query("SELECT userid FROM users WHERE email = $1",[req.email.toLowerCase()]);
        let userId = updated.rows[0].userid;
        let salt = await bcrypt.genSalt((userId%15)+1);
        let hash = await bcrypt.hash(req.password, salt);
        
        let now = new Date().toUTCString();
        await pgClient.query("INSERT INTO day(userid, level, race, date, nameface, whosnew, memory, shuffle, forcedchoice, samedifferent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [userId, -1, "asian", now, -1, -1, -1, -1, -1, -1])

        await pgClient.query("UPDATE users SET hashedpassword = $1 WHERE userid = $2", [hash, userId])
            .then(res => {
                pgClient.end();
                return new Promise(function(resolve, reject){
                    resolve(req.email+" successfully registered!"); //NOTE: Return value doesn't seem to be passing right now.  May need to use another await?
                })
            })
            .catch(err => {
                pgClient.end();
                return new Promise(function(resolve, reject){
                    reject(err);
                })
            })

        
        
            // .then(res => {
            //     pgClient.end();
            //     return new Promise(function(resolve, reject){
            //         resolve("Initial race data succesfully created.");
            //     })
            // })
            // .catch(err => {
            //     pgClient.end();
            //     return new Promise(function(resolve, reject){
            //         reject(err);
            //     })
            // })
    }
}