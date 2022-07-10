const express = require('express');
const app = express()
const cors = require("cors");
const http = require('http'); //create new http
const mongoose = require('mongoose');
const socket = require("socket.io");
const User = require('./db/models/User');
const Message = require('./db/models/Message');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config(); // add dotnv for config

console.log(Message)


const server = http.createServer(app);
app.use(cors());
app.use(express.json());

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000" //client endpoint and port
    }
});
const randomColor = require('randomcolor'); 

const PORT = process.env.PORT || 5000;
const TOKEN_KEY = process.env.TOKEN_KEY || 'rGH4r@3DKOg06hgj'; 
const HASH_KEY = 7;

//main test page
app.get('/', (req, res) => {
    res.send('here will be login page')
})

const generateToken = (id, userName, isAdmin) => {
    const payload = {
        id,
        userName,
        isAdmin
    }
    return jwt.sign(payload, TOKEN_KEY);
}

const isValidUserName = (userName) => {
    const nameRegex = /[^A-Za-z0-9]/ ;
    return (!nameRegex.test(userName) && userName.trim().length > 2);
}

const getAllDbUsers = async (socket) => {
    const usersDb = await User.find({})
    socket.emit('allDbUsers', usersDb) 
}

const getOneUser = async (userName) => {
    const userInDb = await User.findOne({userName});
    return userInDb;
}

app.post('/login', async (req, res) => {
    try {
        const {userName,password} = req.body;
        if (!isValidUserName(userName)){
            return res.status(400).json({message: 'Invalid username'})
        }
        const dbUser = await getOneUser(userName)

        if (dbUser?.isBanned){
            return res.status(401).json({message: 'Your account has been banned!!!'})
        }
        const hashPassword = await bcrypt.hash(password, HASH_KEY);
        if (!dbUser) {
            const user = new User({
                userName,
                hashPassword,
                isAdmin: !await User.count().exec(),
                isBanned: false,
                isMutted: false
            });

            await user.save()

            return res.json({
                token: generateToken(user.id, user.userName, user.isAdmin)
            });
        }

        if (dbUser && !bcrypt.compareSync(password, dbUser.hashPassword)){
            return res.status(400).json({message: 'Invalid credantials'})
        }
        res.json({
            token:  generateToken(dbUser.id, dbUser.userName, dbUser.isAdmin)
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({message: `Error ${e}`});
    }
})


io.use( async (socket, next) => {
    const token = socket.handshake.auth.token;
    const sockets = await io.fetchSockets();
    
    if(!token) {
        socket.disconnect();
        return;
    }

    const usersOnline = [];
    sockets.map((sock) => {
        usersOnline.push(sock.user);
    }) 

   
    try {
        const user = jwt.verify(token, TOKEN_KEY);
        const userName = user.userName;
        const dbUser = await getOneUser(userName);

        if(dbUser.isBanned){
            socket.disconnect();
            return;
        }
        socket.user = user;
        socket.user.color = randomColor();
        const exist = sockets.find((current) => current.user.userName == socket.user.userName)

        if(exist) {  //&& !user.isAdmin  - add for two or more admins 
            console.log(exist.userName, 'exist twice entering...')   
            exist.disconnect(); 
        } 
    } catch(e) {
        console.log(e);
        socket.disconnect();
    }
    next();
});

io.on("connection", async (socket) => {
    const userName = socket.user.userName;
    const sockets = await io.fetchSockets();
    const dbUser = await getOneUser(userName);

    io.emit('usersOnline', sockets.map((sock) => sock.user)); // send array online users  
    socket.emit('connected', dbUser); //socket.user
   
    if(socket.user.isAdmin){
         getAllDbUsers(socket); 
    }//sent all users from db to admin

    const messagesToShow = await Message.find({}).sort({ 'createDate': -1 }).limit(20);

    socket.emit('allmessages', messagesToShow.reverse());
    socket.on("message", async (data) => {
        const dateNow = Date.now(); // for correct working latest post 
        const post = await Message.findOne({userName}).sort({ 'createDate': -1 })
        const oneUser = await getOneUser(userName);
        if(oneUser.isMutted){  //(oneUser.isMutted || !post)
            return;
        }

        if(((Date.now() - Date.parse(post?.createDate)) < 1500)){
            console.log((Date.now() - Date.parse(post?.createDate)))// can use to show timer near by button
            return;
        }

        // if(!oneUser.isMutted && post){
        // if(((Date.now() - Date.parse(post.createDate)) > 150)){//change later 15000  
        const message = new Message({
                text: data.message,
                userName: userName,
                createDate: Date.now()
            });
            try {
                await message.save(); 
            } catch (error) {
                console.log('Message save to db error', error);   
            }
            io.emit('message', message);
        // }
        // } 
    });
    
    try {
        socket.on("disconnect", async () => {
            const sockets = await io.fetchSockets();
            io.emit('usersOnline', sockets.map((sock) => sock.user));
            console.log(`user :${socket.user.userName} , disconnected to socket`); 
        });
            console.log(`user :${socket.user.userName} , connected to socket`); 
        
        socket.on("muteUser",async (data) => {
            if(!socket.user.isAdmin){
                return;
            }
                // if(socket.user.isAdmin){
                    const {user, prevStatus} = data;
                    const sockets = await io.fetchSockets();
                    const mute = await User.updateOne({userName : user}, {$set: {isMutted :!prevStatus}});
                    getAllDbUsers(socket);
                    const exist = sockets.find( current => current.user.userName == user)
                    const dbUser = await getOneUser(user);
                    
                    if(exist){
                        exist.emit('connected', dbUser);   
                    } 
                // }
           });
    
        socket.on("banUser",async (data) => {
            if(!socket.user.isAdmin){
                return;
            }

            // if(socket.user.isAdmin) { 
                const {user, prevStatus} = data;
                const sockets = await io.fetchSockets();
                const ban = await User.updateOne({userName : user}, {$set: {isBanned:!prevStatus}});
                getAllDbUsers(socket)
                const exist = sockets.find( current => current.user.userName == user)
                
                if(exist){
                    exist.disconnect();  
                }
            // }
           });
    } catch (e) {
        console.log(e);
    }
});


//server and database start
const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/chat')
            .then(() => console.log(`DB started`))
        server.listen(PORT, () => {
            console.log(`Server started. Port: ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start();