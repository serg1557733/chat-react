const jwt = require('jsonwebtoken');
const KEY = '777'

export const generateToken = (id, userName, isAdmin) => {
    const payload = {
        id,
        userName,
        isAdmin
    }
    return jwt.sign(payload, KEY, {expiresIn: '12h'});

}

