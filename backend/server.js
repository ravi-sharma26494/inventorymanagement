const express =require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();

const userRoute = require('./routes/userRoute');
const errorHandler = require('./middleWares/errorMiddleware')
const cookieParser = require('cookie-parser');
const app =express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://rinvent.vercel.app"],
    credentials:true
}));

//Routes Middlewares
app.use("/api/users", userRoute)

//Routes
app.get('/', (req,res)=>{
    res.send('Hello')
})



//Error Middleware: Note:=> It must be at the end of the application just before you listen to the port
app.use(errorHandler);

//Connection to database and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
        .then(console.log("DB Connection Suscessfull"))
        .catch((err)=> console.log(err))
app.listen(PORT, ()=> console.log(`Server is running at: ${PORT}`))