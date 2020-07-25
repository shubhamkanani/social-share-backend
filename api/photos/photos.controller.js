import {photosList} from './photos.modal'
import {Users} from '../users/user.modal'
import {FriendList} from '../Friends/friend.modal'
import {notificationList} from '../notification/notification.modal'
import jwt from 'jsonwebtoken';
import configKey from '../../config'
import mongoose from 'mongoose'
// import { photosRouter } from './photos.restRoute';
// import { isValidObjectId } from 'mongoose';

async function fname(data){
    const usernotification = await notificationList.findOne({userId:data})
    if(!usernotification){
        await notificationList.create({
            userId:data,
            notificaton:[]
        })
    }
}

export const showphotos = async (req,res) =>{
    try{
    const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
    const data = await Users.findOne({emailId:decoded.sub})
    const userId = data._id

    const postData = await photosList.find({userId:userId})
    if(!postData){
        console.log("post data not found");
    }
    else{
        res.send(postData.reverse())
    }
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}

//-------------------------------------------------- add new post

export const newPosts = async (req,res) =>{

    try{
        // console.log(req.file)
        // if(req.file){
        const {location,description,askingPrice,category} = req.body;
        if(req.file){
          const img = req.file.filename
          var imgUrl =  "http://localhost:8000/post/"+img
        }
        // var imgUrl =  "http://159.203.67.155:8000/api/photos/"+img  //For server
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({emailId:decoded.sub})
        const userId =  data._id
        var highBid  = 0
        var now = new Date();

            await photosList.create({
                userId,
                location,
                description,
                askingPrice,
                category,
                highBid,
                imageUrl:imgUrl
            })

            // const friendData = await FriendList.findOne({userId:userId})
            // const fList=friendData.friendList
            // console.log(fList);
            // console.log(fList.length);
            //
            // for(var i = 0;i<fList.length;i++){
            //     const usernotification = await notificationList.findOne({userId:fList[i].friendId})
            //     if(!usernotification){
            //         await notificationList.create({
            //             userId:fList[i].friendId,
            //             notificaton:[]
            //         })
            //     }
            //     await notificationList.findOneAndUpdate({userId:fList[i].friendId},{
            //         $push:{notification : {
            //             type : "new post",
            //             userPostId: userId,
            //             userprofile:data.profileImgURL,
            //             content : data.name + "has created new post",
            //             phostImg : imgUrl,
            //             date : now
            //         }}
            //     })
            // }
            return res.status(201).send({
                success: true,
                message: "post created successfully."
              });
            // }

        // else{
            // res.status(401).send({
            //     success:false,
            //     message:"image file not uploaded"
            //     })
            // }
    }
    catch(err){
        res.status(422).send({ success: false,
            message: err.message });
    }
}

//---------------------------------------------------- add comment

    export const Addcomment = async (req,res) =>{
        try{

            const postId = req.body.postId;
            const newcomment = req.body.newcomment;

            const Pdata = await photosList.findOne({_id:postId})
            const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
            const data = await Users.findOne({emailId:decoded.sub})
            const userId = data._id

            console.log(Pdata.userId)
            var now = new Date();

            await photosList.findByIdAndUpdate({_id:postId},{
                $push:{comment : {_id: mongoose.Types.ObjectId(), userId : userId , newcomment : newcomment , date : now  }}
            })

        fname(Pdata.userId);
        const notNeed = await notificationList.findOne({userId:Pdata.userId})
                if(userId != Pdata.userId){
                    console.log("next step");
                    await notificationList.findOneAndUpdate({userId:Pdata.userId},{
                        $push:{notification : {
                            type : "comment",
                            userCommentId: userId,
                            userprofile:data.profileImgURL,
                            content : data.name + " make comment: \"" + newcomment +"\" on your phost",
                            phostImg : Pdata.imageUrl,
                            date : now
                        }}
                    })
                    console.log("last");
                }else{console.log("self comment");}

            // const total = await photosList.findOne({_id:postId})
            // console.log(total.comment.length)

            return res.status(201).send({
                success:true,
                message:'comment successfully added'
            })
        }
        catch(err){
            res.status(401).send({
                success:false,
                message:err.message
            })
        }
    }

//------------------------------------------------------- add bid in post

    export const newBid = async (req,res) =>{
        try{
            const postId = req.body.postId;
            const newBid = req.body.newBid;

            const Pdata = await photosList.findOne({_id:postId})
            const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
            const data = await Users.findOne({emailId:decoded.sub})
            const userId = data._id
            var now = new Date();

            const hbid = await photosList.findOne({_id:postId})
            var current = hbid.highBid

            async function notis() {
                fname(Pdata.userId);
                const notNeed = await notificationList.findOne({userId:Pdata.userId})
                await notificationList.findOneAndUpdate({userId:Pdata.userId},{
                    $push:{notification : {
                        type : "bid",
                        userBidId: userId,
                        userprofile:data.profileImgURL,
                        content : data.name + "has bidded \"$" + newBid +"\" on your post",
                        phostImg : Pdata.imageUrl,
                        date : now
                    }}
                })
            }

            if(userId!=Pdata.userId){
            if( current < newBid ){
                await photosList.findByIdAndUpdate({_id:postId},{
                    $push:{currentBid : { userId : userId , Bid : newBid , date : now  }}
                })
                await photosList.findByIdAndUpdate({_id:postId},{ highBid : newBid })
                notis();
            }
            else{
                await photosList.findByIdAndUpdate({_id:postId},{
                    $push:{currentBid : { userId : userId , Bid : newBid , date : now  }}
                })
                notis();
            }
            return res.status(201).send({
                success:true,
                message:'bid added successfully'
            })

            }else{res.send("you can\'t big")}

        }
        catch(err){
            res.status(401).send({
                success:false,
                message:err.message
            })
        }
    }

//------------------------------------------------------------- like

    export const AddLike = async (req,res) =>{
        try{
            const postId = req.body.postId;
            const Pdata = await photosList.findOne({_id:postId})

            const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
            const data = await Users.findOne({emailId:decoded.sub})
            const userId = data._id

            var now = new Date();
            const postData = await photosList.findOne({_id:postId})

            var temp = 0
            postData.like.forEach(element => {
                if(element.userId=userId)
                {
                    temp = 1
                }
            });
            if(temp==1){
                console.log("already LIKEED");
                    await photosList.findByIdAndUpdate({_id:postId},{
                        $pull:{like : { userId : userId }}
                    })
                    if(userId != Pdata.userId){
                    await notificationList.findOneAndUpdate({userId:Pdata.userId},{
                        $pull:{notification : { userLikedId: userId }}
                    })
                    }

            }
            if(temp==0){
                console.log("like done");
                await photosList.findByIdAndUpdate({_id:postId},{
                    $push:{like : { userId : userId , date : now  }}
                })
                if(userId != Pdata.userId){
                fname(Pdata.userId);
                const notNeed = await notificationList.findOne({userId:Pdata.userId})
                await notificationList.findOneAndUpdate({userId:Pdata.userId},{
                    $push:{notification : {
                        type : "like",
                        userLikedId: userId,
                        userprofile:data.profileImgURL,
                        content : data.name + " has liked your photo",
                        phostImg : Pdata.imageUrl,
                        date : now
                    }}
                })
                }else{console.log("self like");}
            }
            return res.status(201).send({
                success:true,
                message:' successfully added'
            })

            // const total = await photosList.findOne({_id:postId})
            // console.log(total.like.length)

        }
        catch(err){
            res.status(401).send({
                success:false,
                message:err.message
            })
        }
    }

//----------------------------------------------------------share
    export const sharing = async (req,res) =>{
        try{
        const postId = req.body.postId;
        const sharedUserId = req.body.receiverId;

        const Pdata = await photosList.findOne({_id:postId})
        const Rdata = await Users.findOne({_id:sharedUserId})
        const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
        const data = await Users.findOne({emailId:decoded.sub})
        const userId = data._id
        var now = new Date();


        const friendData = await FriendList.findOne({userId:userId})
        if(!friendData){
            console.log("friend list not found");
        }
        else{
            console.log(friendData.friendList);
        }

        await photosList.findByIdAndUpdate({_id:postId},{
            $push:{share : { userId : userId, sharedUser : sharedUserId , date : now  }}
        })
        if(userId != Pdata.userId){
            fname(Pdata.userId);
            const notNeed = await notificationList.findOne({userId:Pdata.userId})
            await notificationList.findOneAndUpdate({userId:Pdata.userId},{
                $push:{notification : {
                    type : "share",
                    usershareId: userId,
                    receiver: Rdata._id,
                    content : data.name + " make share your post with: \"" + Rdata.name +"\"",
                    phostImg : Pdata.imageUrl,
                    date : now
                }}
            })
        }else{console.log("self share");}
        fname(Pdata.sharedUserId);
        const notNeeded = await notificationList.findOne({userId:sharedUserId})
        await notificationList.findOneAndUpdate({userId:Rdata._id},{
            $push:{notification : {
                type : "share",
                usershareId: userId,
                postId:Pdata._id,
                content : data.name + " recommend to see this post",
                phostImg : Pdata.imageUrl,
                date : now
            }}
        })
        // const total = await photosList.findOne({_id:postId})
        // console.log(total.share.length)
        return res.status(201).send({
            success:true,
            message:'share successfully'
        })
        }catch(err){
            res.status(401).send({
                success:false,
                message:err.message
            })
        }
    }

//------------------------------------------------------------------user uploaded photos
export const userUploadedPhotos = async (req,res) =>{
    try{
    const decoded = await jwt.verify(req.headers.token, configKey.secrets.JWT_SECRET);
    const data = await Users.findOne({emailId:decoded.sub})
    const userId = data._id

    const postData = await photosList.findOne({userId:userId})
    if(!postData){
        console.log("post data not found");
    }
    else{
        postData.forEach(element => {
            console.log(element.imageUrl)
        });
    }
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}
