const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types;

const menteeSchema = new Schema({
    userId:{
        type:ObjectId,
        ref:'UserModel'
    },
    name:{
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
    domain:{
        type:String,
        required:true
    }
},{timestamps:true});

const menteeModel = mongoose.model('menteeModel',menteeSchema);

module.exports = menteeModel;