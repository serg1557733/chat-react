const express = require('express');
const app = express()
const cors = require("cors");
const http = require('http'); //create new http
const mongoose = require('mongoose');
const socket = require("socket.io");
const User = require('./db/models/User');
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


// const saveUsersToDb = async (userName, password, isAdmin ) => {
//     try {
//         const newUser = new User({ userName, password, isAdmin });
//         const user = await newUser.save()
//         res.send(JSON.stringify(user))

//     } catch (error) {
//         console.log(error)
//     }
// }



const TOKEN_KEY = 'rturutrrtrtu 45747547'; //change

const HASH_KEY = 7;




 

const generateToken = (id, userName, isAdmin) => {
    const payload = {
        id,
        userName,
        isAdmin
    }
    return jwt.sign(payload, TOKEN_KEY, {expiresIn: '12h'});

}


app.post('/login', jsonParser, async (req, res) => {
    try {
        const {userName,password} = req.body;

        const hashPassword =await bcrypt.hash(password, HASH_KEY);

        const usersCount = await User.count().exec();//count users rename

        const isFirst = !usersCount;

        const dbUser = await User.findOne({userName})

        if (isFirst) { // if first create as admin
            const newUser = new User({
                                userName,
                                hashPassword,
                                isAdmin: true
                            });
            //trycatch?     

            const user = await newUser.save();
            const token = generateToken(user._id, userName, user.isAdmin);
            res.json(token)
            return;
            
            } 
        if (dbUser) { //if find must login
                try {
                    const token = generateToken(user._id, userName, user.isAdmin);
                    res.json({token})
                } catch (e) {
                    console.log(e)
                }

        } else { //create new user in db
            const newUser = new User({
                userName,
                hashPassword,
                isAdmin: false
            });
            
            const user = await newUser.save();
            console.log(user);
            const token = generateToken(user._id, userName, user.isAdmin);
            res.json({token})
        }

    } catch (e) {
        console.log(e)
    }
})






//on connection listen messages and send back text and user name in chat
// io.on("connection", (socket) => {
//     socket.on("message", (data) => {
//         console.log(data.message); //         io.emit('chat_message',{
//             message: data.message,
//             name: data.name
//         })
//       });

//   console.log(`user with ID :${socket.id} , connected to socket`); 
// });




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