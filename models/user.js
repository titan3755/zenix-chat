const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    user_id: {type: String, required: true},
})
const model = mongoose.model('UserModel', UserSchema)
module.exports = model