import {User} from '../model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMail from '../middleware/sendMail.js';
import TryCatch from '../middleware/TryCatch.js';

export const register = TryCatch(async(req,res)=>{
    const {name,email,password} = req.body;

        if(!name || !email | !password) return res.status(401).json("Fields are required");

        const existUser = await User.findOne({email:email});
        if(existUser) return res.status(400).json({
            message : "User Already Exist"
        });

        // hash the Password
        const hashPass = await bcrypt.hash(password,10);

        const newUser = {
            name,email,password:hashPass
        }

        // Generate Random OTP
        const OTP = Math.floor(Math.random() * 1000000)  // TO get 6 digit number set 6 times 0 after 1

        // Generate Token
        const activationToken = jwt.sign({
            newUser,
            OTP,
        }, process.env.SECRETKEY, {
            expiresIn: "5m",
          });

        const data = {
            name,OTP,
        }

        await sendMail(email, "E learning", data);

        return res.status(200).json({
          message: "Otp send to your mail",
          activationToken,
        });
})

export const verifyUser = TryCatch(async(req,res)=>{
    const {OTP,activationToken} = req.body;

    const verified = jwt.verify(activationToken, process.env.SECRETKEY);

    if(!verified) return res.status(400).json({message:"OTP Expired"});
    if(!verified.OTP === OTP) return res.status(400).json({message: "Wrong OTP"});

    const registerUser = new User({
        name: verified.newUser.name,
        email: verified.newUser.email,
        password: verified.newUser.password
    })

    await registerUser.save();

    return res.status(200).json({
        message: "User Registered Successfully"
    });

});

export const loginUser = TryCatch(async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password) return res.status(400).json({message: "All Fileds are required"});

    const user = await User.findOne({email:email});

    if(!user) return res.status(400).json({message: "User not exist with entered e-mail."});

    const comparePass = await bcrypt.compare(password, user.password);

    if(!comparePass) return res.status(400).json({message: "Password not match"});

    const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET,{
        expiresIn: "1d"
    });

    if(token) return res.status(200).json({
        message: `Welcome Back ${user.name}`,
        token,
        user
    });
});

export const myProfile = TryCatch(async(req,res)=>{
    const user = await User.findById(req.user.id);

    if(user) return res.status(200).json(user);
})