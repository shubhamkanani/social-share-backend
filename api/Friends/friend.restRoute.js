import express from 'express'
import {
    getFriendList,
} from './friend.controller'
export const userRouter = express.Router();

userRouter.get("/",getFriendList)