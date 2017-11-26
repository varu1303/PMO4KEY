const jwt = require('jsonwebtoken');
const SECRETKEY = require('./../config/secret');


module.exports = token => {
    
    try {
        let decoded = jwt.verify(token, SECRETKEY);
        return decoded;
    } catch(err) {
//        console.log('err ', err);
        return false;
    }

};