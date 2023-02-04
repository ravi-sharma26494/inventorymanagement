const express =require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const path = require("path");
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const contactRoute = require('./routes/contactRoute');
const errorHandler = require('./middleWares/errorMiddleware')
const cookieParser = require('cookie-parser');
const app =express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cors({
    origin: ["http://localhost:3000", "https://reinvent-app.vercel.app"],
    credentials:true
}));
app.use('/uploads', express.static(path.join(__dirname, "uploads")));

//Routes Middlewares
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

//Routes
app.get('/', (req,res)=>{
    res.send('Helloddsff')
})



//Error Middleware: Note:=> It must be at the end of the application just before you listen to the port
app.use(errorHandler);

//Connection to database and start server
const PORT = process.env.PORT || 5000;
// mongoose.connect(process.env.MONGO_URI)
//         .then(console.log("DB Connection Suscessfull"))
//         .catch((err)=> console.log(err))
// app.listen(PORT, ()=> console.log(`Server is running at: ${PORT}`))
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));