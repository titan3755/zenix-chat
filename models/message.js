const mongoose = require('mongoose')
const MsgSchema = new mongoose.Schema({
    author: {type: String, required: true},
    message: {type: String, required: true},
})
const model = mongoose.model('MessageModel', MsgSchema)
module.exports = model