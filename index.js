var express = require('express');
var { Client } = require('pg');
var bodyParser = require('body-parser');
var initialize = require('./initializeDB.js');

initialize.start()
    .then(res => console.log(res))
    .catch(err => console.log(err))

var app = express();

app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

app.get("/", function(req, res, next) {
    if(req.headers.authorization != undefined){
        let auth = req.headers.authorization.split(' ')[1];
        let [user, pass] = Buffer.from(auth, 'base64').toString().split(':');
        res.send(user+' '+pass);
        return;
    }
    res.status(403).send("No login provided");
})