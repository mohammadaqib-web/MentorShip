const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types;

const slotSchema = new Schema({
    postedBy:{
        type:ObjectId,
        ref:'UserModel'
    },
    bookedBy:{
        type:ObjectId,
        ref:'UserModel',
        default:null
    },
    slotDate:{
        type:String,
        required:true
    },
    slotTime:{
        type:String,
        required:true
    }
},{timestamps:true});

const slotModel = mongoose.model('slotModel',slotSchema);
module.exports = slotModel;