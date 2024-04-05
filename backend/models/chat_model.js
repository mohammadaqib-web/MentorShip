const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types;

const chatSchema = new Schema({
    chatBetween:[{
        type:ObjectId,
        ref:'UserModel'
    }],
    chat:[{
        sentBy:{
            type:ObjectId,
            ref:'UserModel'
        },
        message:{
            type:String,
            required:true
        },
        sentAt:{
            type:String,
            required:true
        }
    }]
},{timestamps:true});

const chatModel = mongoose.model('chatModel',chatSchema);
module.exports = chatModel;