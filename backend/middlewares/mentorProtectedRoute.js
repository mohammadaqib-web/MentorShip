const mentorAuthenticate = async(req,res,next) => {
    try {
        const role = req.user.role;
        if(role!="mentor"){
            return res.status(401).json({message:"You are not a Mentor!"});
        }

        next();
    } catch (error) {
        return res.status(400).json({message:error.message});
    }
}

module.exports = mentorAuthenticate;