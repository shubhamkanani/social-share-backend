import express from 'express'
import {userRouter} from './users'
import {friendRouter} from './Friends'
import {photosRouter} from './photos'
import { notificationRouter } from './notification/notification.restRoute';

export const restRouter = express.Router();
restRouter.use('/user',userRouter)
restRouter.use('/friend',friendRouter)
// restRouter.use('/matirial',materialRouter);
restRouter.use('/photos',photosRouter)
restRouter.use('/notification',notificationRouter)
