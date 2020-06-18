const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')



router.use((req,res,next)=>{
    res.locals.user = req.user
    res.locals.errors =req.flash('errors')
    res.locals.success = req.flash('success')
    next()
  })
  
router.get('/movies', controller.movies)
router.get('/random', controller.random)

module.exports = router