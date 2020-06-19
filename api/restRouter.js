import express from 'express'
import {userRouter} from './users'
export const restRouter = express.Router();
restRouter.use('/user',userRouter)
// restRouter.use('/matirial',materialRouter);