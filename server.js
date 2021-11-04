const mongoose = require('mongoose')
const Message = require('./models/message')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: 'http://localhost:3000'}})

mongoose.connect('mongodb+srv://mahmudTest:Amimuhaimin123@apidatabase.als7u.mongodb.net/APIDatabase?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to DB!')
        server.listen(4000, () => {
            console.log('Server listening on port 4000!')
            io.on('connection', async (socket) => {
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