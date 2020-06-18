const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name:{type:String, require:true, lowercase:true},
    email:{type:String,unique:true,required:true,lowercase:true},
    password:{type:String,required:true, min:3}
})


module.exports = mongoose.model('user',UserSchema)