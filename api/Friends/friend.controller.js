import {FriendList} from './friend.modal'
import {Users} from '../users/user.modal'

//push and query
const pullQuery = async(matchId,branchMatchId,branchName) =>{
    await FriendList.updateOne({userId:matchId},
        {
            $pull:{
                [branchName]:{
                        friendId:branchMatchId
                }
            }
        });
}
const pushQuery = async(matchId,branchMatchId,branchName) => {
    await FriendList.updateOne({userId:matchId},
        {
            $push:{
                [branchName]:{
                    $each:[{
                        friendId:branchMatchId,
                        date:new Date()
                    }]
                }
            }
        });
}
//get friend list

export const getFriendList = async (req,res) =>{
    try{
        const {userId} = req.body
        //fetch the data of friendList
        const data= await FriendList.findOne({userId:userId});
        //check data fetched successfull or not
        if(!data){
            res.status(401).send({
                success:false,
                message:'List are not scaned successfully or no friend available'
            })
        }
        //send fetched data list
        res.status(201).send({
            success:true,
            message:'List fetched successfully',
            friendList:[data.friendList]
        })
    }
    catch(err){
        res.status(401).send({
            success:false,message:err.message
        });
    }
}

//when user send friend request

export const sentFriendRequest = async (req,res) =>{
    try{
        const {userId,requestId} = req.body;

        const userFind = await FriendList.find({userId:userId});

        const requestUserFind = await FriendList.find({userId:requestId})
        //check user  and requestUser document, available or not! , if not then genrate it
        if(userFind<=0){                                                       
            await FriendList.create({
                userId:userId,
                friendList:[],
                getRequest:[],
                sentRequest:[]
            })
        }
        if(requestUserFind<=0){                                                        
            await FriendList.create({
                userId:requestId,
                friendList:[],
                getRequest:[],
                sentRequest:[]
            })
        }
        //find request inside datbase if found than send response false
        var findRequest = false;
        if(!userFind.length<=0){
                await userFind[0].getRequest.map((item) =>{
                    if(item.friendId==requestId){
                            findRequest = true;
                    }
                })
                await userFind[0].sentRequest.map((item)=>{
                    if(item.friendId==requestId){
                        findRequest = true;
                    }
                })
                await userFind[0].friendList.map((item)=>{
                    if(item.friendId==requestId){
                        findRequest = true;
                    }
                })
        }
        if(findRequest){
            return res.status(401).send({
                success:false,
                message:"friend request already sent or recive either you are already friends" 
            })
        }
        //set request in database and send positive response
            //pushQuery(matchId,BranchMatchId,BranchName);
            pushQuery(userId,requestId,"sentRequest");
            pushQuery(requestId,userId,"getRequest");
                res.status(201).send({
                    success:true,
                    message:'request sent successfully'
                })
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
} 

//when approve friend request

export const friendRequestAccept = async(req,res) =>{
    try{
        const {userId,requestId} = req.body; 
        const userFind = await FriendList.find({userId:userId}) //check the user exist or not
        const requestedUser = await Users.findById({_id:requestId}); 
        //console.log('user', requestedUser)
        //find request exist or not if not then send negative response
        var requestExist = false;
        userFind[0].getRequest.map((item)=>{
            if(item.friendId==requestId){
                requestExist = true;
            }
        })
        if(!requestExist){
            return res.status(401).send({
                success:false,
                message:"Request are not exist"
            })
        }
        pushQuery(userId,requestId,"friendList");
        pullQuery(userId,requestId,"getRequest");
        pushQuery(requestId,userId,"friendList");
        pullQuery(requestId,userId,"sentRequest");    
        return res.status(200).send({
            success:true,
            message:'you and ' + [requestedUser.userName] + " are friend's now"
        })
        
}
    catch(err){
        res.status(401).send({
            success:true,message:err.message
        });
    }
}

//when user want friend request List
export const showFriendRequetList = async(req,res) =>{
    try{
        const {userId} = req.body
        const userFind = await FriendList.find({userId:userId});
        //check user is exist yes then fetch data else send nagative response
        if(!userFind){                                                          
            await FriendList.create({
                userId:userId,
                friendList:[],
                getRequest:[],
                sentRequest:[]
            })
        }
        res.status(200).send({success:true,
            message:'List found',
            list:userFind.getRequest})
        }
    catch(err){
        res.status(401).send({
            success:true,
            message:err.message
        })
    }
}
//when user reject friend request
export const rejectFriendRequest = async(req,res) =>{
    try{
        const {userId,requestId} = req.body;
        pullQuery(userId,requestId,"getRequest"); //remove request from user account
        pullQuery(requestId,userId,"sentRequest");//remove request from requested account
        return res.status(201).send({
            success:true,
            message:'reject successfully'
        })
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        }) 
    }
}