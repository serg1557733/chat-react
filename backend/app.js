
const express = require('express');
const app = express()
const cors = require("cors");
const http = require('http'); //create new http
const mongoose = require('mongoose');
const socket = require("socket.io");



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
        await mongoose.connect('mongodb+srv://serg1557733:1557733@cluster0.yddbo.mongodb.net/chat_db?retryWrites=true&w=majority'); //conect to database
        server.listen(PORT, () => {
            console.log(`Server started. Port: ${PORT}`)
        })   
    } catch (e) {
        console.log(e)
    }

}

start();

