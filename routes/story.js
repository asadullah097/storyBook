const express=require('express');

const router=express.Router();

const Story=require('../models/Story');

const {ensureAuth}=require('../middleware/auth');
const { route } = require('.');
//@desc  show add page
//@route  GET /stories/add
router.get('/add',ensureAuth,(req,res)=>{
   
 res.render('stories/add');
});

//@desc  process form data
//@route  Post /
router.post('/',ensureAuth,async(req,res)=>{
try {
       req.body.user=req.user.id
       await Story.create(req.body)
       res.redirect('/dashboard')
} catch (err) {
    console.error(err);
    res.render('error/500')
}
});
//@desc single story
//@route GET /story/{id}
router.get('/:id',ensureAuth,(req,res)=>{
 const story=Story.find(req.params.id).lean()
 res.render('stories/show',{story})
});
//@desc  public stories
//@route  GET /stories/
router.get('/',ensureAuth,async(req,res)=>{
   try {
       const stories=await Story.find({status:"public"}).populate('user').sort({createdAt:'desc'}).lean()
       res.render('stories/index',{stories})
      
   } catch (err) {
       console.error(err);
       res.render('error/500');
   }
});
   
module.exports=router;