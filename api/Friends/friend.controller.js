import {FriendList} from './friend.modal'

//get friend list

export const getFriendList = async (req,res) =>{
    try{
        const data= await FriendList.find({userId:userId});
        
    }
    catch(err){
        res.status(401).send({
            success:true,message:err.message
        });
    }
}

//set friend list

export const  setFriend = async(req,res) =>{
    try{
        const userFind = await FriendList.find({userId:userId})
        if(!userFind){
            await FriendList.create({
                userId:userId,
            })
        }
    }
    catch(err){
        res.status(401).send({
            success:true,message:err.message
        });
    }
}

//check req already exist

export const checkReqAlreadyExist = async(req,res)=>{
    try{

    }
    catch(err){
        res.status(401).send({
            success:true,message:err.message
        });
    }
}

//set friend req

export const setFriendRequest = async(req,res) =>{
    try{

    }
    catch(err){
        res.status(401).send({
            success:true,message:err.message
        });
    }
}