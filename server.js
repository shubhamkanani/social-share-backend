import express from "express";
import cors from "cors";
import {connect} from './db'
import setupMiddware from './middlewares'
import {authRouter} from './aurthorization'
import {restRouter} from './api/restRouter'
const app = express();

require("dotenv").config()

setupMiddware(app)

connect();

app.use(cors());
app.use('/auth',(req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization, Accept, Access-Control-Al" +
        "low-Methods"
    )
  res.header("X-Frame-Options", "deny")
  res.header("X-Content-Type-Options", "nosniff")
  next();
})
app.use('/auth',authRouter)
app.use(express.static('public'))
app.use('/api',(req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Authorization, Accept, Access-Control-Al" +
        "low-Methods"
    )
  res.header("X-Frame-Options", "deny")
  res.header("X-Content-Type-Options", "nosniff")
  next();
})
app.use('/api',restRouter)
export default app;
