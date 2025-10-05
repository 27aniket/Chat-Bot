import sendMail from "../middlewares/sendMail.js"
import {User} from "../models/User.js"
import jwt from "jsonwebtoken"
import connectDB from "../config/db.js";

export const loginUser = async(req,res) => {
    await connectDB();
    try {
        const {email} = req.body

        let user = await User.findOne({email})

        if(!user){
            user = await User.create({
                email,
            })
        }

        const otp = Math.floor(Math.random() * 1000000);

        const verifyToken = jwt.sign(
          {
            user,
            otp,
          },
          process.env.ACTIVATION_SEC,
          {
            expiresIn: "10m",
          }
        );

        await sendMail(email,"ChatBot",otp);
        res.json({
            message:"OTP Send To Your Mail",
            verifyToken,
        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}


export const verifyUser = async(req,res) => {
    try {
        const {otp,verifyToken} = req.body;

        const verify = jwt.verify(verifyToken, process.env.ACTIVATION_SEC);

        if(!verify) return res.status(400).json({
            message: "OTP Expired"
        })

        if(verify.otp !== otp) return res.status(400).json({
            message: "Wrong OTP "
        });

        const token = jwt.sign({ _id: verify.user._id }, process.env.JWT_SEC, {
          expiresIn: "5d",
        });

        res.json({
            message: "Logged In Successfully",
            user: verify.user,
            token,

        })
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
};


export const myProfile = async(req,res) => {
    try {
        const user = await User.findById(req.user._id)

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }

}



