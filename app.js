const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const apiRouter = require('./routes/index')

const app = express();

dotenv.config();

mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    .then(()=>console.log("DB connected"))
    .catch(()=>console.log("Cannot connect to DB"))

app.use(express.json());

app.use('/api',apiRouter);

const port = process.env.PORT;
app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})