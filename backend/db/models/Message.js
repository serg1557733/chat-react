const {model, Schema} = require('mongoose');

const Message = new Schema({
    text: {type: String, required: true},
    author : {type: String, required: true},
    createDate: {type: String, required: true}
})

module.exports = model('Message', Message)