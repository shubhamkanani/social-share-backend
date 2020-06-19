import express from "express";
import {
    getProfile
} from './user.controller'
export const userRouter = express.Router();

userRouter.get('/profile',getProfile);