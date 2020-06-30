import {FriendList} from './friend.modal'

//get friend list

export const getFriendList = async (req,res) =>{
    try{
        const data= await FriendList.find({userId:userId});
        
    }
    catch(err){

    }
}

//set friend list

export const  setFriend = async(req,res) =>{
    try{
        
    }
    catch(err){

    }
}

//check req already exist

export const checkReqAlreadyExist = async(req,res)=>{
    try{

    }
    catch(err){

    }
}

//set friend req

export const setFriendRequest = async(req,res) =>{
    try{

    }
    catch(err){

    }
}