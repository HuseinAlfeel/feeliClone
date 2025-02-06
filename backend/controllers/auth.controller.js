import { generateTokenAndSetCookie} from "../lib/utils/generateToken.js";
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req,res) =>{
    try{
        const{fullName, username, email, password} = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // using this regular expression
        if(!emailRegex.test(email)) { // check if email is valid
            return res.status(400).json({ error: "Invalid email format"});
        }

        const existingUser = await User.findOne({username});
        if(existingUser){ // if username already exists
            return res.status(400).json({error: "Username is already taken"});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){ // if email already exists
            return res.status(400).json({error: "Email is already taken"});
        }

        if(password.length < 6){ // if password is shorter than 6 characters :)
            return res.status(400).json({error: "Password must be at least 6 characters long"});
        }
        // Passwords should be hashed :) using bycriptjs .. 

        const salt = await bcrypt.genSalt(10);
        const hashedPassword  = await bcrypt.hash(password, salt); // Store the password hased .. not as it is :)

        const newUser = new User({
            fullName: fullName,
            username: username,
            email: email,
            password: hashedPassword
        })


        // If all tests are passed .. we're good to go to store the user in our data base :)
        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg,
            })
        }else{
            res.status(400).json({ error: "Invalid user data"});

        }
         
    }catch(error){
        console.log("Error in the signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error"});

    }
};

export const login = async (req,res) =>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"})
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        })
 
    
    }catch(error){
        console.log("Error in the login controller", error.message);
        res.status(500).json({ error: "Internal Server Error"});

    }
};

export const logout = async (req,res) =>{
    try{
        res.cookie("jwt","",{maxAge:0}) // Here we should destroy the cookie to fully logout :)
        res.status(200).json({message: "Logged out successfully"});


    }catch(error){
        console.log("Error in the logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error"});

    }
};

export const getMe = async (req, res) => { // Get the user logged in :) 
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in the getMe controller", error.message);
        res.status(500).json({ error: "Internal Server Error"});
    }
}