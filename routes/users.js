const express = require('express');
const router = express.Router();


const {check,validationResult} = require('express-validator')

const controller = require('../controller/controller')


/* GET users listing. */

router.use((req,res,next)=>{
  res.locals.user = req.user
  res.locals.errors =req.flash('errors')
  res.locals.success = req.flash('success')
  next()
})
const auth = ((req,res,next)=>{
  if(req.isAuthenticated()){
      next()
  }else
  res.redirect('/notallowed')
})

router.get('/notallowed',(req,res)=>{
  res.render('notAllowed')
})
router.get('/',(req,res)=> { 
  res.render('index')
})


const loginCheck = [
  check('email').isEmail(),
  check('password').isLength({min:3})
]

const loginValidate = (req,res,next)=>{
  const info = validationResult(req)
  if(!info.isEmpty()){
      req.flash('errors', 'Invalid Email or Password')
      return res.redirect('/login')
  }
  next()
}

router.post('/login',loginCheck,loginValidate, controller.auth)

router.get('/logged',auth,(req,res)=>{
  res.render('logged')
})
router.get('/login',(req,res)=>{
  res.render('login')

})
router.get('/bootstrap',(req,res)=>{
  res.render('bootstrap')

})
router.get('/thankyou',(req,res)=>{
  res.render('thankyou')
})
router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/register',controller.register)

router.get('/logout',(req,res)=>{
  req.logout()
  req.flash('success', 'You are now logged out')
  res.redirect('/login')
})
module.exports = router;
