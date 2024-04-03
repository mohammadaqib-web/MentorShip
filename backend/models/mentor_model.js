const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types;

const mentorSchema = new Schema ({
    userId:{
        type:ObjectId,
        ref:'UserModel'
    },
    name:{
        type:String,
        required:true
    },
    skills:[{
        type:String,
        required:true
    }],
    profile:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    }
},{timestamps:true});

const mentorModel = mongoose.model('mentorModel',mentorSchema);
module.exports = mentorModel;