const crypto = require('crypto');
const fs = require('fs');


let SESSION_SECRET;  //It is generating strong token


if(!process.env.SESSION_SECRET){
    SESSION_SECRET = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync('.env', `SESSION_SECRET=${SESSION_SECRET}\n`, {flag:'a'});
}else{
    SESSION_SECRET = process.env.SESSION_SECRET;
}

module.exports = SESSION_SECRET;