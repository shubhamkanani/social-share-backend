import express from 'express'
import {userRouter} from './users'
import {friendRouter} from './Friends'
export const restRouter = express.Router();
restRouter.use('/user',userRouter)
restRouter.use('/friend',friendRouter)
// restRouter.use('/matirial',materialRouter);
