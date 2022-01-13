const {model, Schema} = require('mongoose');

const Message = new Schema({
    text: {type: String, required: true},
    userName : {type: String, required: true},
    createDate: {type: Date, required: true}
})

module.exports = model('Message', Message)