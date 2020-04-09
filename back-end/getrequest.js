// JavaScript source code

// Three methods to get request from front end

//we need a front end file to send the request

//HTTP module
const https = require("https");
const url = "https://github.com/asandridge/psych-capstone/blob/master/front-end/";
https.get(url, res => {
res.setEncoding("utf8");
let body = "";
res.on("data", data => {
body += data;
});
res.on("end", () => {
body = JSON.parse(body);
console.log(body);
});
});

//Axios module 
const axios = require("axios");
//const url = "https://github.com/asandridge/psych-capstone/blob/master/front-end/";
const getData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
getData(url);

//request module
const request = require("request");
//const url = "https://github.com/asandridge/psych-capstone/blob/master/front-end/";
request.get(url, (error, response, body) => {
let json = JSON.parse(body);
console.log(body);
});