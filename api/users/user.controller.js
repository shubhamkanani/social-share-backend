import {Users} from './user.modal'
import mongoose from 'mongoose'
// get user profile by id
export const getProfile = async(req,res) =>{
    try{
        const userId = req.query.id;
        const profileData = await Users.aggregate([
            {
                $match:{
                    _id: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $project:{
                    name:1,
                    emailId:1,
                    mobileNo:1,
                    userName:1
                }
            }
        ])
        if(profileData.length<=0){
            res.status(401).send({
                success:false,
                message:'somthing goes to wrong in find data'
            })
        }
        else{
            res.status(201).send({
                success:true,
                data:profileData,
                message:'data find successfully'
            })
        }
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}