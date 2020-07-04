import express from "express";
import {
    getProfile,
    serachUser,
    updateUser
} from './user.controller'
export const userRouter = express.Router();

userRouter.get('/profile',getProfile);
userRouter.post('/serach',serachUser);
userRouter.post('/update',updateUser)