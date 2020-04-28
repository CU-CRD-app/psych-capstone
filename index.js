var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var initialize = require('./initializeDB.js');
var userData = require('./userData.js');
var register = require('./registerUser.js');
var login = require('./login.js');
var tasks = require('./tasks.js');
var preassessment = require('./preassessment.js');
var postassessment = require('./postassessment.js');

initialize.start()
    .then(res => console.log(res))
    .catch(err => console.log(err))

var app = express();

app.use(bodyParser.json());

//Ref: https://github.com/troygoode/node-cors-server/blob/master/server.js
const corsOptions = {
    origin: true,
    methods: ["GET","POST", "OPTIONS", "PUT"],
    credentials: true,
    maxAge: 3600,
    enablePreflight: true,
    preflightContinue: true
}

app.options("*", cors(corsOptions));

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.get("/", cors(corsOptions), function(req, res, next) {
    if(req.headers.authorization != undefined){
        let auth = req.headers.authorization.split(' ')[1];
        let [user, pass] = Buffer.from(auth, 'base64').toString().split(':');
        res.send(user+' '+pass);
        return;
    }
    res.status(403).send("No login provided");
})

app.put("/register/", cors(corsOptions), function(req, res, next) {
    register.user(req.body)
        .then(result => res.send(result))
        .catch(err => {
            if(typeof(err) === 'string'){
                res.status(400).send(err);
            }
            else{
                res.status(500).send("Internal server error");
            }
        })
})

app.post("/login/", cors(corsOptions), function(req, res, next) {
    login.login(req.body)
        .then(result => res.send(result))
        .catch(err => {
            if(typeof(err) === 'string'){
                if(err == "Account not found"){
                    res.status(403).send(err);
                }
                else{
                    res.status(400).send(err);
                }
            }
            else{
                res.status(500).send("Internal server error");
            }
        })
})

app.post("/tasks/", cors(corsOptions), function(req, res, next) {
    tasks.upload(req.body)
        .then(result => res.json({result:result}))
        .catch(err => {
            if(typeof(err) === 'string'){
                res.status(400).send(err);
            }
            else{
                res.status(500).json({"result":"Internal server error"});
            }
        })
})

app.post("/userData/", cors(corsOptions), function(req, res, next) {
    userData.userData(req.body)
        .then(result => res.send(result))
        .catch(err => {
            if(typeof(err) === 'string'){
                res.status(400).send(err);
            }
            else{
                res.status(500).send("Internal server error");
            }
        })
})

app.put("/checktoken/", cors(corsOptions), function(req, res, next){
    //TODO: actually implement token logic
    if(typeof(req.body.token) !== "undefined"){
        res.json({status:"valid"});
    }
    else{
        res.status(400).json({status:"invalid"});
    }
})

app.put("/preassessment/", cors(corsOptions), function(req, res, next){
    preassessment.upload(req.body)
        .then(result => res.send(result))
        .catch(err => {
            if(typeof(err) === 'string'){
                res.status(400).send(err);
            }
            else{
                res.status(500).send("Internal server error");
            }
        })
})

app.put("/postassessment/", cors(corsOptions), function(req, res, next){
    postassessment.upload(req.body)
        .then(result => res.send(result))
        .catch(err => {
            if(typeof(err) === 'string'){
                res.status(400).send(err);
            }
            else{
                res.status(500).send("Internal server error");
            }
        })
})