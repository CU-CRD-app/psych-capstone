// This file defines the endpoints used in the backend, and calls the proper functions to handle data
// The return values of those functions are then parsed and sent along with the proper http status code
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
var tokenHandler = require('./token.js');
var password = require('./passwordChange.js');
var fs = require("fs");
const leaderboard = require('./leaderboard.js');
var { Client } = require('pg');
var {addAchievement, getConsecutiveDaysPlayed} = require("./achievements");
const achievements = require('./achievements');



var initAttempts = 5;
var initSleep = 3 * 1000;  // 3 seconds

function doInit(attempts) {
    if (attempts == 0) {
        console.log("Unable to initialize database!");
        return
    }
    console.log(`Trying to init, ${attempts} attempts left`);
    initialize.start()
    .then(res => console.log(res))
    .catch(
        err => { 
            console.log(err);
            setTimeout(
                function() { doInit(attempts - 1); },
                initSleep,
            );
        }
    );
}

doInit(initAttempts);
var app = express();
var do_not_select_index = 0;

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

app.post("/getHiscores/", cors(corsOptions), function(req, res, next) {
    leaderboard.getHiscores(req.body.gamemode)
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        res.status(400).send("Error fetching hiscores.");
    })
})

app.post("/login/", cors(corsOptions), function(req, res, next) {
    login.login(req.body)
        .then(result => res.send(result))
        .catch(err => {
            if(typeof(err) === 'string'){
                if(err == "Account not found"){
                    res.status(401).send(err);
                }
                else{
                    res.status(400).send(err);
                }
            }
            else{
                console.log(err);
                res.status(500).send("Internal server error");
            }
        })
})

// All endpoints past this point require a token to access

app.post("/get_achievements", cors(corsOptions), async(req, res) => {

    if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
        res.status(401).send("Please provide a properly formatted token")
    }
    else{
       tokenHandler.verify(req.header('Authorization').split(' ')[1])
            .then(id => {
                achievements.getAchievements(id)
                    .then(result => res.json({result:result}))
                    .catch(err => {
                        if(typeof(err) === 'string'){
                            res.status(400).send(err);
                        }
                        else{
                            res.status(500).send("Internal server error");
                        }
                    })
            })
            .catch(err => res.status(401).send("Invalid token")) 
    }
})

app.post("/tasks/", cors(corsOptions), function(req, res, next) {
    if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
        res.status(401).send("Please provide a properly formatted token")
    }
    else{
       tokenHandler.verify(req.header('Authorization').split(' ')[1])
            .then(id => {
                tasks.upload(req.body, id)
                    .then(result => res.json({result:result}))
                    .catch(err => {
                        if(typeof(err) === 'string'){
                            res.status(400).send(err);
                        }
                        else{
                            res.status(500).send("Internal server error");
                        }
                    })
            })
            .catch(err => res.status(401).send("Invalid token")) 
    }
    
})

app.post("/userData/", cors(corsOptions), function(req, res, next) {
    if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
        res.status(401).send("Please provide a properly formatted token")
    }
    else{
        tokenHandler.verify(req.header('Authorization').split(' ')[1])
            .then(id => {
                userData.userData(id)
                    .then(result => res.send(result))
                    .catch(err => {
                        if(typeof(err) === 'string'){
                            if(err == "Account not found"){
                                res.status(401).send(err);
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
            .catch(err => res.status(401).send("Invalid token"))
    } 
})

app.put("/checktoken/", cors(corsOptions), function(req, res, next){
    if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
        res.status(401).send("Please provide a properly formatted token")
    }
    else{
        tokenHandler.verify(req.header('Authorization').split(' ')[1])
            .then(id => res.status(200).json({message: "Valid token"}))
            .catch(err => res.status(401).json({message: "Invalid token"}))
    }
})

app.put("/preassessment/", cors(corsOptions), function(req, res, next){
    if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
        res.status(401).send("Please provide a properly formatted token")
    }
    else{
        tokenHandler.verify(req.header('Authorization').split(' ')[1])
            .then(id => {
                preassessment.upload(req.body, id)
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
            .catch(err => res.status(401).send("Invalid token"))
    }
})

app.put("/postassessment/", cors(corsOptions), function(req, res, next){
    if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
        res.status(401).send("Please provide a properly formatted token")
    }
    else{
      tokenHandler.verify(req.header('Authorization').split(' ')[1])
        .then(id => {
            postassessment.upload(req.body, id)
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
        .catch(err => res.status(401).send("Invalid token"))  
    } 
})

app.put("/changepassword/", cors(corsOptions), function(req, res, next){
    if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
        res.status(401).send("Please provide a properly formatted token")
    }
    else{
        tokenHandler.verify(req.header('Authorization').split(' ')[1])
            .then(id => {
                password.update(req.body)   
                    .then(result => res.send(result))
                    .catch(err => {
                        if(typeof(err) === 'string'){
                            res.status(400).send(err);
                        }
                        else{
                            console.log(err);
                            res.status(500).send("Internal server error");
                        }
                    })
            })
            .catch(err => res.status(401).send("Invalid token")) 
    }
})

// -------REF: https://bost.ocks.org/mike/shuffle/ -------
function shuffle(array) {
    var m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }
// -------shuffle function ends-------

app.put("/getTrainingFaces/", cors(corsOptions), function(req, res, next){
    if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
        res.status(401).send("Please provide a properly formatted token")
    }
    else{
        tokenHandler.verify(req.header('Authorization').split(' ')[1])
            .then(id => {
                try {
                    var images = [];
                    var level_index = req.body.level - 1;
                    var raceName = req.body.race;
                    console.log("/getTrainingFaces/");
                    console.log(req.body.race);
                    
                    //This for loop select 8 photos accordingly.
                    for (var i = 0; i < 8; i++) {
                        if (i == level_index) {
                            //random choose (level_index + 1) picture(s) from level-i
                            var total_num = fs.readdirSync(`./faces/${raceName}/training/level-${i}`).length;
                            var img_indices = Array.from(Array(total_num).keys());
                            shuffled_indices = shuffle(img_indices);
                            //-------Setting up do_not_select_index for getwhosnew
                            if (level_index == 0) {
                                do_not_select_index = shuffled_indices[0];
                            }
                            //-------Setting up do_not_select_index ends here.
                            for (var j = 0; j < level_index + 1; j++) {
                                random_index = shuffled_indices[j];
                                var data = fs.readFileSync(`./faces/${raceName}/training/level-${i}/${random_index}.jpg`);
                                images.push(new Buffer(data, 'binary').toString('base64'));
                            }
                        }
                        if (i > level_index) {
                            //random choose 1 picture from Level-i 
                            var total_num = fs.readdirSync(`./faces/${raceName}/training/level-${i}`).length;
                            var random_index = Math.floor(Math.random() * total_num );
                            var data = fs.readFileSync(`./faces/${raceName}/training/level-${i}/${random_index}.jpg`);
                            images.push(new Buffer(data, 'binary').toString('base64'));
                        }
                    }
                    // -------Debug session codes-------
                    // var images = [];
                    // var total_num = fs.readdirSync(`./faces/${raceName}/training/level-${req.body.level - 1}`).length;
                    // var img_indices = Array.from(Array(total_num).keys());
                    // // var img_indices = [0, 1, 2, 3, 4, 5, 6, 7];
                    // var shuffled_indices = _.shuffle(img_indices);
                    // for (var i = 0; i < 8; i++) {
                    //     random_index = shuffled_indices[i];
                    //     var data = fs.readFileSync(`./faces/${raceName}/training/level-${req.body.level - 1}/${random_index}.jpg`);
                    //     images.push(new Buffer(data, 'binary').toString('base64'));
                    // }
                    // -------Debug session ends-------
                    res.status(200).send({images: images});
                } catch (err) {
                    res.status(500).send("Internal server error");
                }
            })
            .catch(err => res.status(401).send("Invalid token")) 
    }
})

// app.put("/getDailyAssessmentFaces/", cors(corsOptions), function(req, res, next){
//     if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
//         res.status(401).send("Please provide a properly formatted token")
//     }
//     else{
//         tokenHandler.verify(req.header('Authorization').split(' ')[1])
//             .then(id => {
//                 try {
//                     var images = [];
//                     var faceNums = [];
//                     var raceName = req.body.race;
//                     console.log("/getDailyAssessmentFaces/");
//                     console.log(req.body.race);
//                     var total_num = fs.readdirSync(`./faces/${raceName}/daily-assessment`).length;
//                     for (var i = 0; i < 8; i++) { // Generate 8 random numbers between 0 and total_num
//                         var face = Math.floor(Math.random() * total_num);
//                         while (faceNums.indexOf(face) > -1) { // Account for repeats
//                           face = Math.floor(Math.random() * total_num);
//                         }
//                         faceNums.push(face);
//                         var data = fs.readFileSync(`./faces/${raceName}/daily-assessment/${faceNums[i]}.jpg`);
//                         images.push(new Buffer(data, 'binary').toString('base64'));
//                     }
//                     res.status(200).send({images: images});
//                 } catch (err) {
//                     res.status(500).send("Internal server error");
//                 }
//             })
//             .catch(err => res.status(401).send("Invalid token")) 
//     }
// })

app.put("/getPrePostAssessmentFaces/", cors(corsOptions), function(req, res, next){
    if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
        res.status(401).send("Please provide a properly formatted token")
    }
    else{
        tokenHandler.verify(req.header('Authorization').split(' ')[1])
            .then(id => {
                try {
                    var raceName = req.body.race;
                    console.log("/getPrePostAssessmentFaces/");
                    console.log(req.body.race);
                    if(raceName == "asian" || raceName == "black" || raceName == "latino" || raceName == "white"){
                        console.log("/getPrePostAssessmentFaces/ into choosed groups.");
                        var images = [];
                        var total_num = fs.readdirSync(`./faces/${raceName}/pre-post-assessment`).length;
                        var faceNums = [];
                        for (var i = 0; i < 30; i++) { // Generate 30 random numbers between 0 and total_num
                            var face = Math.floor(Math.random() * total_num);
                            while (faceNums.indexOf(face) > -1) { // Account for repeats
                            face = Math.floor(Math.random() * total_num);
                            }
                            faceNums.push(face);
                            var data = fs.readFileSync(`./faces/${raceName}/pre-post-assessment/${faceNums[i]}.jpg`);
                            images.push(new Buffer(data, 'binary').toString('base64'));
                        }
                        res.status(200).send({images: images});
                    }
                    else{
                        console.log("/getPrePostAssessmentFaces/ into cross groups.");
                        var images = [];
                        var total_num = fs.readdirSync(`./faces/pre-post-assessment`).length;
                        var faceNums = [];
                        for (var i = 0; i < 30; i++) { // Generate 30 random numbers between 0 and total_num
                            var face = Math.floor(Math.random() * total_num);
                            while (faceNums.indexOf(face) > -1) { // Account for repeats
                            face = Math.floor(Math.random() * total_num);
                            }
                            faceNums.push(face);
                            var data = fs.readFileSync(`./faces/pre-post-assessment/${faceNums[i]}.jpg`);
                            images.push(new Buffer(data, 'binary').toString('base64'));
                        }
                        res.status(200).send({images: images});
                    }
                    // var images = [];
                    // // var raceName = null;
                    // // var random_face_index = Math.floor(Math.random() * (4));//Generate random seed from 0 to 3.
                    // // switch (random_face_index) {
                    // //     case 0:
                    // //         raceName = "asian";
                    // //         break;
                    // //     case 1:
                    // //         raceName = "black";
                    // //         break;
                    // //     case 2:
                    // //         raceName = "latino";
                    // //         break;
                    // //     case 3:
                    // //         raceName = "white";
                    // //         break;
                    // //   }
                    // // console.log("/getPrePostAssessmentFaces/");
                    // // console.log(raceName);
                    // var total_num = fs.readdirSync(`./faces/pre-post-assessment`).length;
                    // var faceNums = [];
                    // console.log("flag1");
                    // for (var i = 0; i < 30; i++) { // Generate 30 random numbers between 0 and total_num
                    //     var face = Math.floor(Math.random() * total_num);
                    //     console.log(`flag in loop: ${i}`);
                    //     while (faceNums.indexOf(face) > -1) { // Account for repeats
                    //       face = Math.floor(Math.random() * total_num);
                    //     }
                    //     faceNums.push(face);
                    //     console.log(`flag_2 in loop: ${i}`);
                    //     var data = fs.readFileSync(`./faces/pre-post-assessment/${faceNums[i]}.jpg`);
                    //     images.push(new Buffer(data, 'binary').toString('base64'));
                    //     console.log(`flag_3 in loop: ${i}`);
                    // }
                    // res.status(200).send({images: images});
                    // console.log(`ending flag`);
                } catch (err) {
                    res.status(500).send("Internal server error");
                }
            })
            .catch(err => res.status(401).send("Invalid token")) 
    }
})

// -------REF: https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array -------
function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
}
//-------removeItemAll function ends-------

app.put("/getWhosNewFaces/", cors(corsOptions), function(req, res, next){
    if(typeof(req.header('Authorization')) === 'undefined' || req.header('Authorization').split(' ').length < 2){
        res.status(401).send("Please provide a properly formatted token")
    }
    else{
        tokenHandler.verify(req.header('Authorization').split(' ')[1])
            .then(id => {
                try {
                    var images = [];
                    var raceName = req.body.race;
                    console.log("/getWhosNewFaces/");
                    console.log(req.body.race);
                    //select 8 random photos from previous stage. Except for the first level. Since there is no previous one, 
                    //use the do_not_select_index to avoid repetition.
                    var level_index = req.body.level - 1;
                    if (level_index == 0) {
                        var total_num = fs.readdirSync(`./faces/${raceName}/training/level-${level_index}`).length;
                        var img_indices = Array.from(Array(total_num).keys());
                        console.log("Check img_indices:");
                        console.log(img_indices);
                        console.log("Check do_not_select_index:");
                        console.log(do_not_select_index);
                        removeItemAll(img_indices, do_not_select_index);
                        console.log("Check img_indices after the removal:");
                        console.log(img_indices);
                        shuffled_indices = shuffle(img_indices);
                        for (var j = 0; j < 8; j++) {
                            random_index = shuffled_indices[j];
                            var data = fs.readFileSync(`./faces/${raceName}/training/level-${level_index}/${random_index}.jpg`);
                            images.push(new Buffer(data, 'binary').toString('base64'));
                        }
                    } else {
                        var total_num = fs.readdirSync(`./faces/${raceName}/training/level-${level_index - 1}`).length;
                        var img_indices = Array.from(Array(total_num).keys());
                        console.log("(For not-0 level)Check img_indices:");
                        console.log(img_indices);
                        shuffled_indices = shuffle(img_indices);
                        for (var j = 0; j < 8; j++) {
                            random_index = shuffled_indices[j];
                            var data = fs.readFileSync(`./faces/${raceName}/training/level-${level_index - 1}/${random_index}.jpg`);
                            images.push(new Buffer(data, 'binary').toString('base64'));
                        }
                    }
                    res.status(200).send({images: images});
                } catch (err) {
                    console.log(err)
                    res.status(500).send("Internal server error");
                }
            })
            .catch(err => res.status(401).send("Invalid token")) 
    }
})
