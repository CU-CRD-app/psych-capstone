const crypto = require('crypto');
const fs = require('fs');

const publicFile = 'public.b64'
const privateFile = 'secret.b64'

function getWriteErrorCallback(fileName) {
    return function handleError(err) {
        if (err) console.log(`Unable to write to ${fileName}`, err);
    }
}

function genDevPair(prefix) {
    console.log("Generating key pair for dev server.");
    crypto.generateKeyPair('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
    }, (err, publicKey, privateKey) => {
        if (err != undefined) {
            console.log("Unable to create dev keypair, login functionality may break", err);
        } else {
            publicKey = Buffer.from(publicKey).toString('base64');
            privateKey = Buffer.from(privateKey).toString('base64');
            pf = prefix + publicFile;
            prf = prefix + privateFile;
            fs.writeFile(pf, publicKey, getWriteErrorCallback(pf));
            fs.writeFile(prf, privateKey, getWriteErrorCallback(prf));
        }
    })
}

if (!fs.existsSync(process.env.prefix + publicFile)) {
    genDevPair(process.env.prefix);
}
