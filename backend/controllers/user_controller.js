const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const userOtpVerification = require('../models/user_otp_model');
const dotenv = require('dotenv').config;
const cloudinary = require('cloudinary');
const menteeModel = require('../models/mentee_model');
const mentorModel = require('../models/mentor_model');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  },
});


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const addUser = async(req,res) => {
    const {username,email,role,password}=req.body;
    if(!username||!email||!role||!password){
        return res.status(400).json({message:"All fields are mandatory!"});
    }

    const findMail = await UserModel.findOne({email});
    if(findMail){
        return res.status(400).json({message:"Email already registered!"});
    }

    const hashedPassword = await bcrypt.hash(password,16);
    const newUser = new UserModel({username,email,role,password:hashedPassword,isVerified:false});
    const user = await newUser.save();
    if(!user){
        return res.status(400).json({message:"Error while saving user!"});
    }

    sendOtpVerificationEmail(user,res);

    // return res.status(200).json({message:"User created successfully!",user:user});
}

const verifyOTP = async(req,res)=>{
    try {
        const {userId,otp} = req.body;
        if(!userId||!otp){
            return res.status(400).json({message:"All fields are mandatory!"});
        }

        const userOtpVerificationRecords = await userOtpVerification.find({userId});
        if(userOtpVerificationRecords.length<=0){
            return res.status(400).json({message:"Account record doesn't exist!"});
        }

        const {expiresAt} = userOtpVerificationRecords[0];
        const hashedOTP = userOtpVerificationRecords[0].otp;

        if(expiresAt<Date.now()){
            await userOtpVerification.deleteMany({userId});
            return res.status(400).json({message:"Code has expired. Please request again!"});
        }
        const validOTP = await bcrypt.compare(otp,hashedOTP);
        if(!validOTP){
            return res.status(400).json({message:"Invalid code passed.Check your inbox!"});
        }

        await UserModel.updateOne({_id:userId},{isVerified:true});
        await userOtpVerification.deleteMany({userId});

        return res.status(200).json({status:"VERFIED",message:"User email verified successfully!"});
    } catch (error) {
        return res.status(400).json({status:"FAILED",message:error.message});
    }
}

const resendOTPVerificationCode = async(req,res) => {
    try {
        const {userId,email} = req.body;
        const user = {_id:userId,email}
        if(!userId||!email){
            return res.status(400).json({message:"Empty details are not allowed!"});
        }

        const checkVeirfied = await UserModel.findOne({email});
        if(!checkVeirfied){
            return res.status(400).json({message:"Kindly fill up the SignUp form first!"});
        }

        if(checkVeirfied.isVerified){
            return res.status(400).json({message:"Email already verified!"});
        }

        await userOtpVerification.deleteMany({userId});
        sendOtpVerificationEmail(user,res);
    } catch (error) {
        return res.status(400).json({status:"FAILED",message:error.message});
    }
}

const loginUser = async(req,res) => {
    const {email,password} = req.body;
    if(!email||!password){
        return res.status(400).json({message:"All fields are mandatory!"});
    }

    const user = await UserModel.findOne({email});
    if(!user){
        return res.status(400).json({message:"Email is not Registered!"});
    }

    if(!user.isVerified){
        return res.status(401).json({message:"Kindly verify your email to LogIn!"});
    }

    const checkPassword = await bcrypt.compare(password,user.password);
    if(!checkPassword){
        return res.status(400).json({message:"Email or Password is incorrect!"});
    }

    const token = await jwt.sign(user.email,process.env.JWT_SECRET);
    const userInfo = {"id":user._id,"email":user.email,"username":user.username};

    return res.status(200).json({message:"User logged in successfully!",user:userInfo,token:token});
}

const sendOtpVerificationEmail = async(user,res)=>{
    try {
        const { _id, email } = user;
        const otp = `${Math.floor(1000+Math.random()*9000)}`;

        const mailOptions = ({
            from: `"Job Dekho"${process.env.SMTP_MAIL}`, // sender address
            to: email, // list of receivers
            subject: `Verify Your Email`, // Subject line
            html: `<p>Enter <strong>${otp}</strong> in the app to verify your email address and complete the signup!</p>
            <p>This code <strong>expires in 1 hour</strong>.</p>`, 
        });

        const hashedOTP = await bcrypt.hash(otp,10);
        const saveOtp = new userOtpVerification({
            userId:_id,
            otp:hashedOTP,
            createdAt:Date.now(),
            expiresAt: Date.now()+3600000
        }) 

        await saveOtp.save();
        await transporter.sendMail(mailOptions);
        return res.status(201).json({status:"PENDING",message:"Verification OTP sent to E-mail",data:{userId:_id,email}});
    } catch (error) {
        return res.status(400).json({status:"FAILED",message:error.message});
    }
}

const editMenteeProfile = async (req, res) => {
    const { name, domain, location } = req.body;
    const image = req.file.path;

    try {
        if (!name || !domain || !location || !image) {
            return res.status(400).json({ message: "All fields are mandatory!" });
        }

        const cloudinaryResult = await cloudinary.uploader.upload(image);
        if (!cloudinaryResult) {
            return res.status(400).json({ message: "Error while uploading image" });
        }

        const findMenteeData = await menteeModel.find({ userId: req.user._id });
        if (findMenteeData.length > 0) {
            const updateData = await menteeModel.updateOne({ userId: req.user._id }, { name, domain, location, image: cloudinaryResult.secure_url });
            if (updateData.modifiedCount === 1) {
                return res.status(200).json({ message: "Details updated successfully!" });
            } else {
                return res.status(400).json({ message: "Error while updating details!" });
            }
        } else {
            const menteeData = new menteeModel({ userId: req.user._id, name, domain, location, image: cloudinaryResult.secure_url });
            const resp = await menteeData.save();
            if (resp) {
                return res.status(200).json({ message: "Details saved successfully!" });
            } else {
                return res.status(400).json({ message: "Error while saving details!" });
            }
        }
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

const editMentorProfile = async(req,res) => {
    const {name,skills,about,location,company,profile} = req.body;
    const image = req.file.path;

    try {
        if(!name||!skills||!about||!location||!company||!image||!profile){
            return res.status(400).json({message:"All fields are mandatory!"});
        }

        const cloudinaryResult = await cloudinary.uploader.upload(image);
        if (!cloudinaryResult) {
            return res.status(400).json({ message: "Error while uploading image" });
        }

        const findMentorData = await mentorModel.find({ userId: req.user._id });
        if (findMentorData.length > 0) {
            const updateData = await mentorModel.updateOne({ userId: req.user._id }, { name, location, image: cloudinaryResult.secure_url,skills,about,company,profile });
            if (updateData.modifiedCount === 1) {
                return res.status(200).json({ message: "Details updated successfully!" });
            } else {
                return res.status(400).json({ message: "Error while updating details!" });
            }
        } else {
            const mentorData = new mentorModel({ userId: req.user._id, name, location, image: cloudinaryResult.secure_url,skills,about,company,profile });
            const resp = await mentorData.save();
            if (resp) {
                return res.status(200).json({ message: "Details saved successfully!" });
            } else {
                return res.status(400).json({ message: "Error while saving details!" });
            }
        }
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
}

const getAllMentors = async(req,res) => {
    try {
        const findMentors = await mentorModel.find();
        if(findMentors.length<=0){
            return res.status(400).json({message:"No Mentors Found!"});
        }

        return res.status(200).json({message:"Mentors Found",mentors:findMentors});
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
}

const getMentorsBySearch = async(req,res)=>{
    const {name,location,profile} = req.body;

    try {
        if(!name&&!location&&!profile){
            return res.status(400).json({message:"You have to fill atleast one section to search!"});
        }

        if(name){
            const findByName = await mentorModel.find({name:{ $regex: name, $options: 'i' }});
            if(!findByName){
                return res.status(400).json({message:"Mentor not found!"});
            }

            return res.status(200).json({message:"Mentor Found",mentor:findByName});
        }

        if(location){
            const findByLocation = await mentorModel.find({location:{ $regex: location, $options: 'i' }});
            if(!findByLocation){
                return res.status(400).json({message:"Mentor not found!"});
            }

            return res.status(200).json({message:"Mentor Found",mentor:findByLocation});
        }

        if(profile){
            const findByProfile = await mentorModel.find({profile:{ $regex: profile, $options: 'i' }});
            if(!findByProfile){
                return res.status(400).json({message:"Mentor not found!"});
            }

            return res.status(200).json({message:"Mentor Found",mentor:findByProfile});
        }

        if(name&&location){
            const find = await mentorModel.find({name:{ $regex: name, $options: 'i' },location:{ $regex: location, $options: 'i' }});
            if(!find){
                return res.status(400).json({message:"Mentor not found!"});
            }

            return res.status(200).json({message:"Mentor Found",mentor:find});
        }

        if(name&&profile){
            const find = await mentorModel.find({name:{ $regex: name, $options: 'i' },profile:{ $regex: profile, $options: 'i' }});
            if(!find){
                return res.status(400).json({message:"Mentor not found!"});
            }

            return res.status(200).json({message:"Mentor Found",mentor:find});
        }

        if(profile&&location){
            const find = await mentorModel.find({profile:{ $regex: profile, $options: 'i' },location:{ $regex: location, $options: 'i' }});
            if(!find){
                return res.status(400).json({message:"Mentor not found!"});
            }

            return res.status(200).json({message:"Mentor Found",mentor:find});
        }

        if(name&&location&&profile){
            const find = await mentorModel.find({name:{ $regex: name, $options: 'i' },location:{ $regex: location, $options: 'i' },profile:{ $regex: profile, $options: 'i' }});
            if(!find){
                return res.status(400).json({message:"Mentor not found!"});
            }

            return res.status(200).json({message:"Mentor Found",mentor:find});
        }
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
}

module.exports = {
    addUser,
    loginUser,
    verifyOTP,
    resendOTPVerificationCode,
    editMenteeProfile,
    editMentorProfile,
    getAllMentors,
    getMentorsBySearch
}