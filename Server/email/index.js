const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

exports.test = function (email,htmltext){
     let transporter = nodemailer.createTransport({
        host:'smtp.qq.com',
        secureConnection:true,
        port:465,
        auth:{
            user:"1076986776@qq.com",
            pass:"gvqyxrnegbrygcgi"
        }
    })
    let options={
        from:'1076986776@qq.com',
        to:email,
        subject:'Chat Room',
        html:htmltext
    }
    transporter.sendMail(options,function(err,msg){
        if(err){
            console.log(err);
        }else{
            res.send(msg);
            transporter.close();
        }
    })
}
// module.exports=router;
