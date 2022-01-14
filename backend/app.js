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
const moment = require('moment');



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
    return jwt.sign(payload, TOKEN_KEY, {expiresIn: '12h'});

}


const isValidUserName = (userName) => {
    const nameRegex = /[^A-Za-z0-9]/ ;
    return (!nameRegex.test(userName) && userName.trim());
}



const saveMessage = async (data, userName) => {
    const message = new Message({
        text: data.message,
        userName: userName,
        createDate:new Date()
    });
    try {
        await message.save() 
    } catch (error) {
        console.log(error)   
    }
}

//express-validator may use

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

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if(!token) {
        socket.disconnect();
        return
    }
    
    try {
        const user = jwt.verify(token, TOKEN_KEY)
        console.log(user)
        socket.user = user;
    } catch(e) {
        console.log(e)
        socket.disconnect();
    }
    
    next();
});


io.on("connection", (socket) => {
    socket.emit('connected', socket.user)
    socket.on("message", (data) => {
        const userName = socket.user.userName;
        //add time validation
        saveMessage(data, userName)
    });
    try {
        socket.on("disconnect", () => {
            console.log(`user :${socket.user.userName} , disconnected to socket`); 
           });
            console.log(`user :${socket.user.userName} , connected to socket`); 
        
    } catch (e) {
       // console.log(e)
    }

});



//find time of last user post
const findLastPostTime = async (userName) => {
    try {
       // console.log({username})
        const posts = await Message.findOne({userName}).sort({ 'createDate': -1 });
        return posts.createDate;
   
    } catch (error) {
        console.log(error)
    }
}


findLastPostTime('ghgggggggggggggggggg')
.then( user => console.log(user))





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