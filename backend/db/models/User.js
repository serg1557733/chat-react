const {model, Schema} = require('mongoose');

const User = new Schema({
    userName: {type: String, unique: true, required: true},
    hashPassword: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    isBanned: {type: Boolean, default: false},
    isMutted: {type: Boolean, default: false}

})

module.exports = model('User', User)