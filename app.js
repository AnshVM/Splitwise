const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const apiRouter = require('./routes/index')
const cookieParser = require('cookie-parser')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

dotenv.config();

mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    .then(()=>console.log("DB connected"))
    .catch(()=>console.log("Cannot connect to DB"))

app.use(express.json());
app.use(cookieParser())
app.use('/api',apiRouter);

io.on('connection', (socket) => {
    console.log(socket.handshake.query.userId)
    socket.join(socket.handshake.query.userId)
    socket.on('UPDATED_BALANCES',(args)=>{
        socket.to(args).emit("UPDATED_BALANCES")
    })
});

const port = process.env.PORT;
server.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})
