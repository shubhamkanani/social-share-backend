import mongoose, {Schema} from 'mongoose';
import timestamps from "mongoose-timestamp";

const userSchema = Schema({
    name:String,
    emailId:String,
    password:String,
    mobileNo:Number,
    userName:String,
    designation:String,
    country:String,
    state:String,
    city:String,
    hobbies:Array,
    profileImgURl:String,
    coverImgURl:String,
    content:String
}, { timestamps: {createdAt:'created_at'} })

export const Users = mongoose.model('userInfo',userSchema);
