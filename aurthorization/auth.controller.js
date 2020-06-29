import {Users} from '../api/users'
import bcrypt from 'bcrypt-nodejs'
import jwt from 'jsonwebtoken'
import configKey from '../config'
import nodemailer from 'nodemailer'

// mail object
const smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "shubhamkanani.dds@gmail.com",
      pass: 'Sh9825784600'
    }
  });
// Registration api

export const signup = async (req,res) =>{
    try{
        const {email,name,uname,password} = req.body;
        const userName = uname;
        const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const mobileNoRegexp = /\(?\d{3}\)?-? *\d{3}-? *-?\d{6}/;
        if(emailRegexp.test(email)){
            const emailId = email.toLowerCase();
            const isEmailExist = await Users.findOne({emailId: emailId});
            console.log(isEmailExist);
            if(isEmailExist){
                return res
                    .status(422)
                    .send({ success: false, message: "Email is alrady exist" });
            }
            console.log(bcrypt.hashSync(password))
            await Users.create({
                emailId,
                name,
                userName,
                password:bcrypt.hashSync(password),
            })
            return res.status(201).send({
                success: true,
                message: "User created successfully."
              });
        }
        else if(mobileNoRegexp.test(email)){
            const mobileNo = email;
            const ismobileNoExist = await Users.findOne({mobileNo:mobileNo})
            if(ismobileNoExist){
                return res
                    .status(422)
                    .send({ success: false, message: "Mobile number is alrady exist" });
            }
            await Users.create({
                mobileNo,
                name,
                userName,
                password:bcrypt.hashSync(password),
            })
            return res.status(201).send({
                success: true,
                message: "User created successfully."
              });
        }
        else{
            return res.status(401).send({
                success: false,
                message: "User not created."
              });
        }
    }
    catch(err){
        res.status(422).send({ success: false, message: err.message });
    }
}

//token genration
const expirationInterval =
    (process.env.NODE_ENV === "development")? 30 * 24 * 60 * 60: (parseInt(process.env.JWTSECRET) || 1) * 24 * 60 * 60;

const tokenForUser = (user) => {
    try {
      console.log(user.emailId)
      const timestamp = new Date().getTime();
      return jwt.sign(
        {
          sub: user.emailId,
          iat: timestamp,
          // entityDetails: loginDetails.relatedFaEntities[0],
          exp: Math.floor(Date.now() / 1000) + expirationInterval
        },
        configKey.secrets.JWT_SECRET
      );
    }
    catch (err) {
      throw err;
    }
  };

//signin api

export const signin = async (req,res) => {
    const {email} = req.body;
    try{
        const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const mobileNoRegexp = /\(?\d{3}\)?-? *\d{3}-? *-?\d{6}/;
            if(emailRegexp.test(email)){
               const userExistence = await Users.findOne({emailId:email.toLowerCase()})
               if(userExistence){
                res.status(200).send({
                    success: true,
                    token: tokenForUser(userExistence),
                    data:userExistence
                  });
            }
            }
            else if(mobileNoRegexp.test(email)){
               const userExistence = await Users.findOne({mobileNo:email})
               if(userExistence){
                res.status(200).send({
                    success: true,
                    token: tokenForUser(userExistence),
                    data:userExistence
                  });
            }
            }
    }
    catch(err){
        res.status(422).send({
            success: false,
            error: `Unable to Login using email - ${email}`
          });
    }
}

//forget password Link genration

export const forgotPassword = async (req,res) =>{
  try{
    let {email} = req.body
    const emailId = email.toLowerCase();
    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegexp.test(emailId)) {
        return res.status(422).send({ success: false, message: "Invalid Email" });
      }
    const isEmailExist = await Users.findOne({emailId:emailId}).then(data => {
        return data ? true : false;
      });
      if (!isEmailExist) {
        return res
          .status(422)
          .send({ success: false, message: "email in not registered" });
      }
      const mail = {
        emailId:email
      }
      const token = tokenForUser(mail);
      const data = {
        to: emailId,
        from: process.env.MAILER_EMAIL_ID,
        subject: "Click Below Link To Reset Password ",
        text:
          "Confirm your email address to get started.\n\n" +
          "Please click on the following link, or paste this into your browser to the reset password process:\n\n" +
          "http://localhost:4200/reset?token=" +
          token +
          "\n\n" +
          "If you did not need this, please ignore this email and your password will remain unchanged.\n"
      };
      await smtpTransport.sendMail(data, err => {
        return err ? res.status(422).send({
              success: false,
              message: err
            }) : res.status(200).send({
              success: true,
              message: "please check your email to reset your password!"
            });
      });
  }
  catch(err){
    res.status(422).send({ success: false, message: err.message });
  }
}
export const resetPassword = async(req,res) =>{
  try{
    const token = req.query.token;
    const decoded =jwt.decode(token)
    console.log(decoded);
    await Users.findOneAndUpdate(
      { emailId: decoded.sub },
      { password: bcrypt.hashSync(req.body.password) }
    );
    return res.status(200).send({
      success: true,
      message: "your password changed successfully!"
    });
  }
  catch(err){
    res.status(422).send({ success: false, message: err.message });
  }
}
