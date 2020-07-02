import express from 'express'
import {
    sentFriendRequest,
    friendRequestAccept,
    getFriendList,
    rejectFriendRequest
} from './friend.controller'
export const friendRouter = express.Router();

friendRouter.post("/send",sentFriendRequest)
friendRouter.post('/accept',friendRequestAccept)
friendRouter.post('/show',getFriendList)
friendRouter.post("/reject",rejectFriendRequest)