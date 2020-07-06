import express from "express";
import {
    getProfile,
    serachUser,
    updateUser,
    setProfileImg,
    setCoverImg
} from './user.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import configKey from '../../config'
import jwt from 'jsonwebtoken';
import { Users } from "./user.modal";
export const userRouter = express.Router();

var pstorage = multer.diskStorage({
    destination: async function(req, file, cb){
        const profileUploadDir = path.join(__dirname,'..','..','public','profile');
        if (fs.existsSync(profileUploadDir)){
            cb(null, profileUploadDir)
        }
        else{
            fs.mkdirSync(profileUploadDir)
            cb(null, profileUploadDir)
        }
    },
    filename:async function(req,file,cb){
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({emailId:decoded.sub})
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        cb(null, data._id+'.'+extension)
    }
})

var cstroge = multer.diskStorage({
    destination: async function(req, file, cb){
        const {userId} = req.body;
        const coverUploaddir = path.join(__dirname,'..','..','public','cover');
        if (fs.existsSync(coverUploaddir)){
            cb(null, coverUploaddir)
        }
        else{
            fs.mkdirSync(coverUploaddir)
            cb(null, coverUploaddir)
        }
    },
    filename:async function(req,file,cb){
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({emailId:decoded.sub})
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        cb(null, data._id+'.'+extension)
    }
})
const uploadCoverImg = multer({storage:cstroge})
const uploadProfileImg = multer({storage:pstorage})

userRouter.post('/setprofileimg', uploadProfileImg.single('image'),setProfileImg);
userRouter.post('/setcoverimg',uploadCoverImg.single('image'),setCoverImg);
userRouter.get('/profile',getProfile);
userRouter.post('/serach',serachUser);
userRouter.post('/update',updateUser);