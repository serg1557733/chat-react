
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


app.post('/login', jsonParser, (req, res) => {
    try {
        console.log(req.body);
        const {userName, password} = req.body;
      //  const newUser = new User({});
      //  console.log(newUser);

        //newUser.save();

        res.send(JSON.stringify('token..'))
    } catch (error) {
        console.log(e)
    }
})


//on connection listen messages and send back text and user name in chat
// io.on("connection", (socket) => {
//     socket.on("message", (data) => {
//         console.log(data.message); 
//         io.emit('chat_message',{
//             message: data.message,
//             name: data.name
//         })
//       });
      
//   console.log(`user with ID :${socket.id} , connected to socket`); 
// });



//server.listen
const start =async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/chat').then(() => console.log(`DB started`))
            const newUser = new User({ userName: 'admin1', password: 'qweqwe', isAdmin: true });
            const user = await newUser.save()
            console.log('user', user)
            
        server.listen(PORT, () => {
            console.log(`Server started. Port: ${PORT}`)
        })   
    } catch (e) {
        console.log(e)
    }

}

start();

