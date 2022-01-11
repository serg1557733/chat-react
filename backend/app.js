
const express = require('express');
const app = express()
const cors = require("cors");
const http = require('http'); //create new http
const mongoose = require('mongoose');
const socket = require("socket.io");
const User = require('./db/models/User');


const server = http.createServer(app);
const jsonParser = express.json(); 
app.use(cors());// cors 


const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000"  //client endpoint and port
  }
});


const PORT = process.env.PORT || 5000;


//main test page
app.get('/', (req, res) => {
  res.send('here will be login page')
})


// const saveUsersToDb = async (userName, password ) => {
//     try {
//         const newUser = new User({ userName, password });
//         const user = await newUser.save()
//         res.send(JSON.stringify(user))
        
//     } catch (error) {
//         console.log(error)
//     }
// }


app.post('/login', jsonParser,async (req, res) => {
    try {
        const {userName, password} = req.body;

        const allUsers = await User.find({}).exec();
        const isFirst = !allUsers.length;
        const dbUser = await User.findOne({userName})

        if (isFirst){                                      // if first create as admin
            const newUser = new User({ userName, password, isAdmin: true});
            const user = await newUser.save();
            console.log(user);
            res.send(JSON.stringify(user))
        } else if(dbUser){        //if find must login
            console.log('find user - must login it')
            res.send(JSON.stringify(dbUser)) 
        } else {   //create new user in db
            const newUser = new User({ userName, password, isAdmin: false});
            const user = await newUser.save();
            console.log(user);
            res.send(JSON.stringify(user))
        }
        
        //res.send(JSON.stringify(dbUser))

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

