const express=require('express')
const cors =require('cors')
const colors=require('colors')
const dotenv=require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const userRouter=require('./routes/userRoute')
const adminRouter=require('./routes/adminRoute')
const connectDB = require('./config/db')
const path =require('path')


const port =process.env.PORT || 8000;

connectDB()
const app=express()

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api/users',userRouter);
app.use('/api/admin',adminRouter)
app.use(errorHandler)

app.listen(port,()=>console.log(`Server started at http://localhost:${port}`))