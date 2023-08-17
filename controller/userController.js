const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const Event = require("../model/eventSchema")



const signup = async (req,res) => {
    try {
        //generate a salt to use for hashing
        const salt = await bcrypt.genSalt(10);

        //hash the password using the generated salt
        const hashedPassword = await bcrypt.hash(req.body.password,salt);

        //create a new user using the user model with the hashed password
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        });

        //save the new user to the database
        const savedUser = await newUser.save();
        
        res.status(200).json({
            success:true,
            message:"User registered successfully",
            user:savedUser
        });
        
    } catch (error) {
        console.log("error",error)
        res.status(500).json({success:false,message:'An error occured during registration',
    error:error.message,
})
    }
}

const login = async (req,res) => {
    try {
        console.log("login controller ",req.body)
        const { email , password } = req.body;

        //check if the user with the given email exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }

        //compare the provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return res.status(401).json({
                success:false,
                message:"Incorrect Password"
            });
        }

        //create and sign a jwt token
        const token = jwt.sign({ userId : user._id}, "secrete", {
            expiresIn:"7d"
        });

        res.status(200).json({
            success:true,
            message:"Login successful",
            token,
            user : {
                id:user._id,
                username:user.username,
                email:user.email,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"An error occured during login",
            error:error.message
        })
    }
}

const getAllUsers = async (req,res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success:true,
            users,
        });
        
    } catch (error) {
        res.status(500).json("interenal server error");
        console.log(error)
    }
}

const invitation = async (req, res) => {
    try {
      const invitationGettingUserId = req.params.id;
      const eventId = req.body.eventId;
      const userId = JSON.stringify(res.locals.user._id);
      // Find the user by ID


      
      const user = await User.findById(invitationGettingUserId);
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        const existingInvitation = user.eventInvitations.find(invitation => invitation?.eventId?.toString() === eventId);
        if (existingInvitation) {
            return res.status(400).json({ message: "Invitation already exists for this user and event" });
        }
      // Create the invitation object
      const invitationObject = {
        eventId: eventId,
        sender: res.locals.user._id, // Assuming you have user data in req.user after authentication
        invitationText: 'Your invitation message here'
      };
  
      // Push the invitation object to the user's eventInvitations array
      user.eventInvitations.push(invitationObject);
  
      // Save the user with the updated eventInvitations array
      await user.save();
      res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

const getAllInvitations = async (req,res) => {
    try {
        const userIdWithQuotes = JSON.stringify(res.locals.user._id);
        const userId = userIdWithQuotes.replace(/"/g, '');
        const user = await User.findById(userId)
        // Fetch all events based on event IDs
        const eventIds = user?.eventInvitations?.map(invitation => invitation.eventId);
        const events = await Event.find({ _id: { $in: eventIds } });
        
        if(!user){
            res.status(400).json({message:"User not found"})
        }
        res.status(200).json({user,events})
      
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}

const rejectInvitation = async (req,res) => {
    try {
        const userIdWithQuotes = JSON.stringify(res.locals.user._id);
        const userId = userIdWithQuotes.replace(/"/g, '');
      const  invitationId = req.params.id;
        // Update the user document to remove the invitation
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { eventInvitations: { eventId: invitationId } } },
        { new: true } // Return the updated user document
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "Invitation rejected successfully" });
  
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
};
const acceptedInvitation = async (req, res) => {
    try {
        const userIdWithQuotes = JSON.stringify(res.locals.user._id);
        const userId = userIdWithQuotes.replace(/"/g, '');
        const acceptedInvitationId = req.params.id;
        const updateUser = await User.findById(userId);

        if (!updateUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const eventToAccept = updateUser.eventInvitations.filter(event => event.eventId.toString() ===  acceptedInvitationId
        );
        if (!eventToAccept) {
            return res.status(404).json({ message: "Invitation not found" });
        }

        eventToAccept.status = true;

        await updateUser.save();

        eventToAccept[0].status = true;

        await updateUser.save();


        res.status(200).json({ message: "Invitation accepted", updateUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = {
    signup,
    login,
    getAllUsers,
    invitation,
    getAllInvitations,
    rejectInvitation,
    acceptedInvitation
}