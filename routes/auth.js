const express=require('express');

const router=express.Router();
const passport=require('passport')
//@desc  login with Google auth
//@route  GET /
router.get('/google', passport.authenticate('google', {  scope:['profile','email'] }));

//@desc  Auth and call back
//@route  GET /dashboard
router.get('/google/callback', 
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/dashboard');
});

//@desc   auth Logout
//@route  /auth/logout

router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/')
})
module.exports=router;