const {model, Schema} = require('mongoose');

export const Message = new Schema({
    text: {type: String, required: true},
})

module.exports = model('Message', Message)