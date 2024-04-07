const UserModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const userOtpVerification = require('../models/user_otp_model');
const dotenv = require('dotenv').config;
const cloudinary = require('cloudinary');
const menteeModel = require('../models/mentee_model');
const mentorModel = require('../models/mentor_model');
const slotModel = require('../models/slot_model');
const chatModel = require('../models/chat_model');

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

const addUser = async (req, res) => {
    const { fullname, email, role, password } = req.body;
    if (!fullname || !email || !role || !password) {
        return res.status(400).json({ message: "All fields are mandatory!" });
    }

    const findMail = await UserModel.findOne({ email });
    if (findMail) {
        return res.status(400).json({ message: "Email already registered!" });
    }
    

    const hashedPassword = await bcrypt.hash(password, 16);
    const newUser = new UserModel({ fullname, email, role, password: hashedPassword, isVerified: false });
    const user = await newUser.save();
    if (!user) {
        return res.status(400).json({ message: "Error while saving user!" });
    }

    sendOtpVerificationEmail(user, res);

    // return res.status(200).json({message:"User created successfully!",user:user});
}

const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            return res.status(400).json({ message: "All fields are mandatory!" });
        }

        const userOtpVerificationRecords = await userOtpVerification.find({ userId });
        if (userOtpVerificationRecords.length <= 0) {
            return res.status(400).json({ message: "Account record doesn't exist!" });
        }

        const { expiresAt } = userOtpVerificationRecords[0];
        const hashedOTP = userOtpVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
            await userOtpVerification.deleteMany({ userId });
            return res.status(400).json({ message: "Code has expired. Please request again!" });
        }
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        if (!validOTP) {
            return res.status(400).json({ message: "Invalid code passed.Check your inbox!" });
        }

        await UserModel.updateOne({ _id: userId }, { isVerified: true });
        await userOtpVerification.deleteMany({ userId });

        return res.status(200).json({ status: "VERFIED", message: "E-mail verified successfully!" });
    } catch (error) {
        return res.status(400).json({ status: "FAILED", message: "Error Occurred!" });
    }
}

const resendOTPVerificationCode = async (req, res) => {
    try {
        const { userId, email } = req.body;
        const user = { _id: userId, email }
        if (!userId || !email) {
            return res.status(400).json({ message: "Empty details are not allowed!" });
        }

        const checkVeirfied = await UserModel.findOne({ email });
        if (!checkVeirfied) {
            return res.status(400).json({ message: "Kindly fill up the SignUp form first!" });
        }

        if (checkVeirfied.isVerified) {
            return res.status(400).json({ message: "Email already verified!" });
        }

        await userOtpVerification.deleteMany({ userId });
        sendOtpVerificationEmail(user, res);
    } catch (error) {
        return res.status(400).json({ status: "FAILED", message: "Error Occurred!" });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are mandatory!" });
    }

    const user = await UserModel.findOne({ email: { $regex: email, $options: 'i' } });
    if (!user) {
        return res.status(400).json({ message: "Email is not Registered!" });
    }

    if(!user.isVerified){
        await UserModel.deleteOne({email: { $regex: email, $options: 'i' }});
        return res.status(400).json({message:"Email not registered!"});
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return res.status(400).json({ message: "Email or Password is incorrect!" });
    }

    const token = await jwt.sign(user.email, process.env.JWT_SECRET);
    const userInfo = { "id": user._id, "email": user.email, "fullname": user.fullname, "role": user.role, "isVerified": user.isVerified };

    return res.status(200).json({ message: "User logged in successfully!", user: userInfo, token: token });
}

const verifyEmail = async(req,res) => {
    const {email} = req.body;

    try {
        const findUser = await UserModel.findOne({email});
        if(!findUser){
            return res.status(400).json({message:"User not found!"});
        }

        const user = {"_id":findUser._id,"email":findUser.email}
        sendOtpVerificationEmail(user,res);
    } catch (error) {
        return res.status(400).json({message:"Error Occurred!"});
    }
}

const sendOtpVerificationEmail = async (user, res) => {
    try {
        const { _id, email } = user;
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const mailOptions = ({
            from: `"Mentor"${process.env.SMTP_MAIL}`, // sender address
            to: email, // list of receivers
            subject: `Verify Your Email`, // Subject line
            html: `<p>Enter <strong>${otp}</strong> in the app to verify your email address and complete the signup!</p>
            <p>This code <strong>expires in 1 hour</strong>.</p>`,
        });

        const hashedOTP = await bcrypt.hash(otp, 10);
        const saveOtp = new userOtpVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        })

        await saveOtp.save();
        await transporter.sendMail(mailOptions);
        return res.status(201).json({ status: "PENDING", message: "Verification OTP sent to E-mail", data: { userId: _id, email } });
    } catch (error) {
        return res.status(400).json({ status: "FAILED", message: "Error Occurred!" });
    }
}

const editMenteeProfile = async (req, res) => {
    const { name, domain, location } = req.body;
    const image = req.file ? req.file.path : null; // Check if req.file exists

    try {
        if (!name || !domain || !location||!image) {
            return res.status(400).json({ message: "All fields are mandatory!" });
        }

        let updateData;
        let message;

        if (image) {
            const cloudinaryResult = await cloudinary.uploader.upload(image);
            if (!cloudinaryResult) {
                return res.status(400).json({ message: "Error while uploading image" });
            }

            const findMenteeData = await menteeModel.find({ userId: req.user._id });
            if (findMenteeData.length > 0) {
                updateData = await menteeModel.updateOne({ userId: req.user._id }, { name, domain, location, image: cloudinaryResult.secure_url });
                message = "Details updated successfully!";
            } else {
                const menteeData = new menteeModel({ userId: req.user._id, name, domain, location, image: cloudinaryResult.secure_url });
                const resp = await menteeData.save();
                if (resp) {
                    message = "Details saved successfully!";
                } else {
                    return res.status(400).json({ message: "Error while saving details!" });
                }
            }
        } else {
            const findMenteeData = await menteeModel.find({ userId: req.user._id });
            if (findMenteeData.length > 0) {
                updateData = await menteeModel.updateOne({ userId: req.user._id }, { name, domain, location });
                message = "Details updated successfully!";
            } else {
                const menteeData = new menteeModel({ userId: req.user._id, name, domain, location });
                const resp = await menteeData.save();
                if (resp) {
                    message = "Details saved successfully!";
                } else {
                    return res.status(400).json({ message: "Error while saving details!" });
                }
            }
        }

        if (updateData && updateData.modifiedCount === 1) {
            return res.status(200).json({ message });
        } else {
            return res.status(400).json({ message: "Error while updating details!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error Occurred!" });
    }
}

const editMentorProfile = async (req, res) => {
    const { name, skills, about, location, company, domain } = req.body;
    const image = req.file ? req.file.path : null; // Check if req.file exists

    try {
        if (!name || !skills || !about || !location || !company||!image  || !domain) {
            return res.status(400).json({ message: "All fields are mandatory!" });
        }

        let updateData;
        let message;

        if (image) {
            const cloudinaryResult = await cloudinary.uploader.upload(image);
            if (!cloudinaryResult) {
                return res.status(400).json({ message: "Error while uploading image" });
            }

            const findMentorData = await mentorModel.find({ userId: req.user._id });
            if (findMentorData.length > 0) {
                updateData = await mentorModel.updateOne({ userId: req.user._id }, { name, location, image: cloudinaryResult.secure_url, skills, about, company, domain });
                message = "Details updated successfully!";
            } else {
                const mentorData = new mentorModel({ userId: req.user._id, name, location, image: cloudinaryResult.secure_url, skills, about, company, domain });
                const resp = await mentorData.save();
                if (resp) {
                    message = "Details saved successfully!";
                } else {
                    return res.status(400).json({ message: "Error while saving details!" });
                }
            }
        } else {
            const findMentorData = await mentorModel.find({ userId: req.user._id });
            if (findMentorData.length > 0) {
                updateData = await mentorModel.updateOne({ userId: req.user._id }, { name, location, skills, about, company, domain });
                message = "Details updated successfully!";
            } else {
                const mentorData = new mentorModel({ userId: req.user._id, name, location, skills, about, company, domain });
                const resp = await mentorData.save();
                if (resp) {
                    message = "Details saved successfully!";
                } else {
                    return res.status(400).json({ message: "Error while saving details!" });
                }
            }
        }

            return res.status(200).json({ message });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!" });
    }
}


const getAllMentors = async (req, res) => {
    try {
        const findMentors = await mentorModel.find();
        if (findMentors.length <= 0) {
            return res.status(400).json({ message: "No Mentors Found!" });
        }

        return res.status(200).json({ message: "Mentors Found", mentors: findMentors });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!" });
    }
}

const getMentorsBySearch = async (req, res) => {
    const { search } = req.body;

    try {
        if (!search) {
            return res.status(400).json({ message: "You have to fill the search field to search!" });
        }

        const mentors = await mentorModel.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
                { domain: { $regex: search, $options: 'i' } }
            ]
        });

        if (!mentors.length) {
            return res.status(400).json({ message: "Mentor not found!" });
        }

        return res.status(200).json({ message: "Mentor Found", mentors });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!" });
    }
}


const createSlot = async (req, res) => {
    const { slotDate, slotTime } = req.body;

    try {
        if (!slotDate || !slotTime) {
            return res.status(400).json({ message: "Both fields are mandatory" });
        }

        const findSlot = await slotModel.find({ postedBy: req.user._id, slotTime, slotDate });
        if (findSlot) {
            return res.status(400).json({ message: "You have already opened this slot!" });
        }

        const makeSlot = new slotModel({ postedBy: req.user._id, slotTime, slotDate });
        const saveSlot = await makeSlot.save();

        return res.status(201).json({ message: "Slot created successfully", slot: saveSlot });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!" });
    }
}

const bookSlot = async (req, res) => {
    const { slotId } = req.body;

    try {
        if (!slotId) {
            return res.status(400).json({ message: "Empty slot ID!" });
        }

        const findSlot = await slotModel.find({ _id: slotId });
        if (findSlot.length === 0) {
            return res.status(400).json({ message: "Slot not found!" });
        }

        const slot = findSlot[0];

        if (slot.bookedBy === req.user._id) {
            return res.status(400).json({ message: "Slot is already booked by someone else!" });
        } else if (slot.bookedBy !== null) {
            return res.status(400).json({ message: "Slot is already booked by you!" });
        }

        const updateSlot = await slotModel.findOneAndUpdate({ _id: slotId }, { bookedBy: req.user._id });
        if (!updateSlot) {
            return res.status(400).json({ message: "Error while booking slot!" });
        }

        return res.status(200).json({ message: "Slot booked successfully!" });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!" });
    }
}

const chat = async (req, res) => {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    const message = req.body.message;
    const dateOptions = { timeZone: 'Asia/Kolkata', hours12: false };
    const currentDate = new Date().toLocaleDateString('en-IN', dateOptions);
    const currentTime = new Date().toLocaleTimeString('en-IN', dateOptions);

    try {
        if (!receiverId || !senderId) {
            return res.status(400).json({ message: "Empty Id!" });
        }

        const findReceiver = await UserModel.findById(receiverId);
        if (!findReceiver) {
            return res.status(400).json({ message: "Receiver not found!" });
        }

        let chat = await chatModel.findOne({ chatBetween: { $all: [senderId, receiverId] } });
        if (chat) {
            chat.chat.push({ sentBy: senderId, message, sentAt: currentDate + `,` + currentTime });
            await chat.save();
            return res.status(200).json({ message: "Message sent!", sentMessage: message });
        }

        chat = new chatModel({
            chatBetween: [senderId, receiverId],
            chat: [{ sentBy: senderId, message, sentAt: currentDate + `,` + currentTime }]
        });
        await chat.save();
        return res.status(201).json({ message: "Chat created successfully!" });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!" });
    }
}

const getChat = async (req, res) => {
    const receiverId = req.params.id;
    const senderId = req.user._id;

    try {
        if (!receiverId || !senderId) {
            return res.status(400).json({ message: "Empty ID!" });
        }

        const chat = await chatModel.findOne({ chatBetween: { $all: [senderId, receiverId] } });
        if (!chat) {
            return res.status(400).json({ message: "Chat not found!" });
        }

        return res.status(200).json({ message: "Chat found!", chat: chat.chat });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!" });
    }
}

const whomIChatted = async (req, res) => {
    const  userId  = req.user._id;

    try {
        const findChats = await chatModel.find({ chatBetween: {$all:[userId]} });
        if (!findChats || findChats.length === 0) {
            return res.status(400).json({ message: "No chats found!" });
        }

        return res.status(200).json({ message: "Chats found!", chat: findChats });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!" });
    }
};


const getMentorProfile = async (req, res) => {
    const mentorId = req.params.id;

    try {
        if (!mentorId) {
            return res.status(400).json({ message: "Empty ID!" });
        }

        const findMentor = await mentorModel.findOne({ userId: mentorId });
        if (!findMentor) {
            return res.status(400).json({ message: "Invalid ID!" });
        }

        return res.status(200).json({ message: "Mentor Found!", mentor: findMentor });
    } catch (error) {
        return res.status(400).json({ message: "Error Occurred!" });
    }
}

const getMentee = async(req,res)=>{
    try {
        const findMentee = await menteeModel.findOne({userId:req.user._id});

        return res.status(200).json({message:"Mentee found!",mentee:findMentee});
    } catch (error) {
        return res.status(400).json({message:"Error Occurred"})
    }
}

const getProfileMentor = async(req,res)=>{
    try {
        const findMentor = await mentorModel.findOne({userId:req.user._id});

        return res.status(200).json({message:"Mentor found!",mentor:findMentor});
    } catch (error) {
        return res.status(400).json({message:"Error Occurred"})
    }
}

const getUser = async(req,res)=>{
    const paramsId = req.params.id;
    
    try {
        const getUser = await UserModel.findById({_id:paramsId});
        if(!getUser){
            return res.status(400).json({message:"User not found!"});
        }

        return res.status(200).json({message:"User found!",user:getUser});
    } catch (error) {
        return res.status(400).json({message:"Error Occurred!"});
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
    getMentorsBySearch,
    createSlot,
    bookSlot,
    chat,
    getChat,
    getMentorProfile,
    getMentee,
    verifyEmail,
    getProfileMentor,
    whomIChatted,
    getUser
}