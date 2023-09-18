const jwt = require("jsonwebtoken");
const {pk} = require('./pk')
exports.encode = (accountId, privatKey=pk) => {
    const data = {
        "payload": {
            "account": `${accountId}`,
            "account_type": "demo-mt5"
        },
        "exp": 1771008484,
        "jti": "fb42947d-ea57-4d7c-bca2-6dcba372d190",
        "iat": 1661007284,
        "iss": "atwallet",
        "sub": "1660226056349x9716433671748092001"
    }
    return  jwt.sign(data, privatKey, { algorithm: 'RS256' });
}