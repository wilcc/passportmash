const axios = require ('axios')
require('dotenv').config()
const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const apiKey = process.env.APIKEY

module.exports={
    random: (req ,res) => {
        axios.get('https://randomuser.me/api/?results=40').then(data =>{ 
            let result = data.data.results
            res.render('random' , {result})
        })
        .catch(err => console.log(err))
    },
    movies: (req ,res) => {
        axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=435bff21167fa3a1076c617e4de99a2e&language=en-US&page=1`)
        .then(data =>{ 
            let result = data.data.results
            res.render('movies' , {result})
        })
        .catch(err => console.log(err))
    },
    auth: passport.authenticate('local-login', {
        successRedirect: '/logged',
        failureRedirect:'/login',
        failureFlash: true
      }),
    register: (req,res)=>{
        User.findOne({email:req.body.email}).then((user)=>{
            if(user){
                // res.status(400).json({message:'User Exists'})
                req.flash('errors', 'Account Exists')
                return res.redirect(301, '/register')
            }else{
            const newUser = new User()
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(req.body.password,salt)
      
            newUser.name = req.body.name
            newUser.email = req.body.email
            newUser.password = hash
      
            newUser.save().then((user)=>{
                req.login(user,(err)=>{
                    if(err){
                        res.status(500).json({confirmation: false, message:'Server error'})
                    }else{
                        res.redirect('/logged')
                    }
                })
            }).catch((err)=>console.log('error'))
            }
        })
      }
}