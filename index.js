const express=require('express')
const app=express()
const authRoute=require('./Routes/auth')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const postRoute=require('./Routes/post')


dotenv.config()
//
mongoose.connect(process.env.DB_CONNECT,
{useUnifiedTopology:true,useNewUrlParser:true} ,()=>{

console.log('connected to db')
})

//middleware
app.use(express.json());


app.use('/api/user',authRoute)
app.use('/api/posts',postRoute);

app.listen(3000,()=>{
    console.log('running')
})