const crypto = require('crypto');
const fs = require('fs');

const publicFile = 'public.pem'
const privateFile = 'private.pem'

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
            pf = prefix + publicFile;
            prf = prefix + privateFile;
            fs.writeFile(pf, publicKey, getWriteErrorCallback(pf));
            fs.writeFile(prf, privateKey, getWriteErrorCallback(prf));
        }
    })
}

genDevPair(process.env.prefix);