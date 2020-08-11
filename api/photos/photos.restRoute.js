import express from "express";
import {
    showphotos,
    newPosts,
    Addcomment,
    newBid,
    AddLike,
    sharing,
    userUploadedPhotos,
    showphotosprofile,
    homePagePost
}

from './photos.controller'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import configKey from '../../config'
import {Users} from '../users'
import { photosList } from "./photos.modal";
import MimeNode from "nodemailer/lib/mime-node";

export const photosRouter = express.Router();

var postStorage = multer.diskStorage({
    destination: async function(req,file,cb){

        const postuploadDir = path.join(__dirname,'..','..','public','post');
        if(fs.existsSync(postuploadDir)){
            cb(null,postuploadDir)
        }
        else{
            fs.mkdirSync(postuploadDir)
            cb(null,postuploadDir)
        }
    },

    filename:async function(req,file,cb){
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({emailId:decoded.sub})

        cb(null,data._id+"_"+Date.now()+"_"+file.originalname)
    }

})

const uploadPostImg = multer ({
    storage:postStorage,
    fileFilter:function(req,file,cb){
        const fileType = /jpeg|jpg|png|gif/;
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        const mimetype = fileType.test(file.mimetype);

        if(mimetype && extension){
            return cb(null,true);
        }else{
            cb('Error:you can upload only Image file');
        }

    }
})



photosRouter.post('/newPosts',uploadPostImg.single('Url'),newPosts)
photosRouter.post('/comment',Addcomment)
photosRouter.post("/bid",newBid)
photosRouter.post("/like",AddLike)
photosRouter.post("/share",sharing)
photosRouter.get("/show",showphotos)
photosRouter.get("/userPhoto",userUploadedPhotos)
photosRouter.get("/showPost",showphotosprofile)
photosRouter.get("/homePost",homePagePost)
