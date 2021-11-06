const mongoose = require('mongoose')
const Message = require('./models/message')
const User = require('./models/user')
const express = require('express')
const cors = require('cors')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {origin: '*'}
})
const PORT = process.env.PORT || 4000

mongoose.connect('mongodb+srv://mahmudTest:Amimuhaimin123@apidatabase.als7u.mongodb.net/APIDatabase?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to DB!')
        server.listen(PORT, () => {
            console.log('Server listening on port 4000!')
            io.sockets.on('connection', async (socket) => {
                socket.on('userJoined', async (username, id) => {
                    let res = await User.create({username: username, user_id: id})
                    let userData = await User.find({})
                    socket.id = id
                    socket.username = username
                    io.emit('userList', userData)
                })
                socket.on('disconnect', async () => {
                    let res = await User.deleteMany({username: socket.username})
                    let userData = await User.find({})
                    io.emit('userList', userData)
                })
                let initialData = await Message.find({})
                io.emit('initialData', initialData)
                socket.on('msgSend', async (msg, author) => {
                    let res = await Message.create({author: author, message: msg})
                    let data = await Message.find({})
                    io.emit('msgRecv', data)
                })
            })
        })
    })
    .catch(() => {
        console.log('Failed to connect to DB!')
    })

app.get('/', (req, res) => {
    res.json({
        status: res.statusCode,
        condition: 'App is working correctly!',
        desc: 'This app is an API for interacting with the Zenix chat application'
    })
})