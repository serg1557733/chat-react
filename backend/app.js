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



const server = http.createServer(app);
const jsonParser = express.json();
app.use(cors()); // cors 



const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000" //client endpoint and port
    }
});


const PORT = process.env.PORT || 5000;


//main test page
app.get('/', (req, res) => {
    res.send('here will be login page')
})


const TOKEN_KEY = 'rGH4r@3DKOg06hgj'; 
const HASH_KEY = 7;



const generateToken = (id, userName, isAdmin) => {
    const payload = {
        id,
        userName,
        isAdmin
    }
    return jwt.sign(payload, TOKEN_KEY, {expiresIn: '48h'});

}

const isValidUserName = (userName) => {
    const nameRegex = /[^A-Za-z0-9]/ ;
    return (!nameRegex.test(userName) && userName.trim());
}



const saveMessage = async (data, userName) => {
    const message = new Message({
        text: data.message,
        userName: userName,
        createDate: Date.now()
    });
    try {
        await message.save() 
    } catch (error) {
        console.log(error)   
    }
}

// const getMessages = async () => {
//     try {
//         await message.find(); 
//     } catch (error) {
//         console.log(error)   
//     }
// }

//get all users from db
const getAllDbUsers = async (socket) => {
    const usersDb = await User.find({})
    socket.emit('allDbUsers', usersDb)
}



app.post('/login', jsonParser, async (req, res) => {
    try {
        const {userName,password} = req.body;
        
        if (!isValidUserName(userName)){
            return res.status(400).json({message: 'Invalid username'})
        }

        const hashPassword = await bcrypt.hash(password, HASH_KEY);

        const usersCount = await User.count().exec();

        const isFirst = !usersCount;
        
        let user;

        if (isFirst) { // if first create as admin
            user = new User({
                                userName,
                                hashPassword,
                                isAdmin: true
                            });
                await user.save();      
        } 

        user = await User.findOne({userName})

        if (!user) {
            user = new User({
                userName,
                hashPassword,
                isAdmin: false
            });
            await user.save()
        }
        if (!bcrypt.compareSync(password, user.hashPassword)){
            return res.status(400).json({message: 'Invalid credantials'})
        }
        const token = generateToken(user._id, userName, user.isAdmin);
        res.json({token})

    } catch (e) {
        console.log(e)
        res.status(500).json({message: `Error ${e}`})
    }
})

//use auth token


io.use( async (socket, next) => {
    const token = socket.handshake.auth.token;
    const sockets = await io.fetchSockets();
    const usersOnline = [];
    sockets.map((sock) => {
        usersOnline.push(sock.user);
    }) 
    if(!token) {
        socket.disconnect();
        return
    }
    try {
        const user = jwt.verify(token, TOKEN_KEY)
        socket.user = user;
      //  console.log('exist', sockets)   
        const exist = sockets.find( current => current.user.userName == socket.user.userName)
      //  sockets.map((current) => console.log(current.user.userName))
      //  console.log('exist', exist)   

        if(exist) {
            console.log('exist', exist)   
            exist.disconnect(); 
        } 
      

    } catch(e) {
        console.log(e)
        socket.disconnect();
        return
    }


    next();
});

io.on("connection", async (socket) => {

    const sockets = await io.fetchSockets();
    const results = [];
    sockets.map((sock) => {
        results.push(sock.user);
    })  
    
    io.emit('usersOnline', results) // send array online users

    socket.emit('connected', socket.user)
    
    if(socket.user.isAdmin) getAllDbUsers(socket); //sent all users from db to admin
    const messagesToShow = await Message.find({}).sort({ 'createDate': -1 }).limit(20)
            socket.emit('allmessages', messagesToShow.reverse()) 
    
    socket.on("message", async (data) => {
        const userName = socket.user.userName;
        const dateNow = Date.now();
        const post = await Message.findOne({userName}).sort({ 'createDate': -1 })
        if(((Date.now() - Date.parse(post.createDate)) > 150)){//change later 15000
        const message = new Message({
                text: data.message,
                userName: userName,
                createDate: Date.now()
            });
            try {
                await message.save() 
            } catch (error) {
                console.log(error)   
            }
            io.emit('message', message)
        }

    });
    try {
        socket.on("disconnect", () => {
            io.emit('usersOnline', results)
            console.log(`user :${socket.user.userName} , disconnected to socket`); 
           });
            console.log(`user :${socket.user.userName} , connected to socket`); 
        
    } catch (e) {
        console.log(e)
    }

});







//server and database start
const start = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/chat')
            .then(() => console.log(`DB started`))
        server.listen(PORT, () => {
            console.log(`Server started. Port: ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}

start();