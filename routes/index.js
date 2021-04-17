const express=require('express');

const router=express.Router();

const Story=require('../models/Story');

const {ensureAuth,ensureGuest}=require('../middleware/auth');
//@desc  Loging/ladnding page
//@route  GET /
router.get('/',ensureGuest,(req,res)=>{
    console.log("working",req.user);
 res.render('Login',{
     layout:'login'
 });
});

//@desc  Dashboard
//@route  GET /dashboard
router.get('/dashboard',ensureAuth,async(req,res)=>{
    try {
        const stories=await Story.find({user:req.user.id}).lean()
        res.render('dashboard',{
            layout:'main',
            name:req.user.firstName,
            stories
        });  
    } catch (error) {
        console.error(error);
        res.render('error/500')
    }
   });
module.exports=router;