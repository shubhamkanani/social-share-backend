import express from 'express'
import {
    sentFriendRequest,
    friendRequestAccept,
    getFriendList,
    rejectFriendRequest,
    suggestedFriend,
    allUser
} from './friend.controller'
export const friendRouter = express.Router();

friendRouter.get("/",allUser)
friendRouter.post("/send",sentFriendRequest)
friendRouter.post('/accept',friendRequestAccept)
friendRouter.post('/show',getFriendList)
friendRouter.post("/reject",rejectFriendRequest)
friendRouter.post('/suggest',suggestedFriend)