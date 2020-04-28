"use strict";
//require('dotenv').config()
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "Keyu.Wu.wky@gmail.com", // generated ethereal user
      pass: "wky19980612" // generated ethereal password
    }
  });

  // send mail with defined transport object
  var target_email = "kewu6458@colorado.edu"
  var confirm_code = Math.random().toString(36).substring(2, 8);
  console.log(confirm_code)
  let info = await transporter.sendMail({
    from: '"Psyc team 👻" <foo@example.com>', // sender address
    to: target_email, // list of receivers
    subject: "Email Verification", // Subject line
    text: "" + confirm_code, // plain text body
    html: '<html><head><style> * {box-sizing: border-box;}'
    + 'body {font-family: Arial, Helvetica, sans-serif;}'
    + 'header {background-color: #666;padding: 5px;text-align: center;font-size: 30px;color: white;}</style></head>'
    + '<body> <h3><b> Your comfirmation code is: </b></h3>'
    + '<header><h2>' + confirm_code + '</h2></header></body></html>'
    + "None-Reply Email: You're receiving this email because " + target_email + " is trying to register on CU-Psychology mobile application."// html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
