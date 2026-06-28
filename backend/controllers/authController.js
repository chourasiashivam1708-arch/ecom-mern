const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');


// generateToken() creates a JWT (JSON Web Token) containing the user's ID. The token is signed using a secret key (JWT_SECRET) and remains valid for 30 days. It is sent to the client after successful login and is used to authenticate future requests without requiring the user to log in again


// FUNCTION FOR GENEARTING THE JWTWEBTOKEN 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendVerificationOtp = async (user, name) => {
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    user.isVerified = false;
    await user.save();

    const message = `
        <h2>Welcome to ShopNest, ${name}!</h2>
        <p>Thank you for registering on our platform.</p>
        <p>Your account verification OTP is: <strong>${otp}</strong></p>
        <p>This OTP expires in 10 minutes.</p>
    `;

    await sendEmail({
        email: user.email,
        subject: 'ShopNest Account Verification OTP',
        message
    });
};

// FUNCTION THAT HANDLES THE REGISTRATION OF A NEW USER: 

// "Is function ke andar future me asynchronous operations ho sakte hain, isliye mujhe await use karne ki permission do."
const registerUser = async (req, res) => {
    // req : client se aane waaala data 
    // res : cliend ko bhejne waala data 
    const { name, email, password } = req.body;
    try {

        // kya wo user currently exist kar raha hai ? 
        const existingUser = await User.findOne({ email });
        // yadi exist kar raha hai toh usse boldo : 'User already exists' 
        if (existingUser && existingUser.isVerified !== false) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        if (existingUser && existingUser.isVerified === false) {
            await sendVerificationOtp(existingUser, existingUser.name);
            return res.status(200).json({
                message: 'Account already exists but is not verified. A new OTP has been sent to your email.',
                email: existingUser.email
            });
        }
        // user ka jo bhi password hai usko hashed karna hai "Library used : bcryptjs "
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ek user banao with details jo user ne daali hai .
        const user = await User.create({ name, email, password: hashedPassword, isVerified: false });

        // yadi user ban gaya hai toh usko ek welcome email bhejna hai otp ke saath warna error msg invalid user data aisa . 
        // 6 digit otp
        if (user) {
            await sendVerificationOtp(user, name);

            res.status(201).json({
                email: user.email,
                message: 'Registration successful. Please verify the OTP sent to your email.'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data ' })
        }  
    } catch (error) {
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isVerified) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }

        if (!user.otp || !user.otpExpires || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired. Please register again to receive a new OTP.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// FUNCTION THAT HANDLES LOGGIN IN OF THE USER : 
const loginUser = async(req,res)=>{
    try{
        // user ne jo login credentials daale hai wo laao.
        const{email,password} = req.body;
        // user ne jo email daala hai us email ka koi user hai kya ye find karo .

        const user = await User.findOne({email});

        if (user && user.isVerified === false) {
            return res.status(403).json({ message: 'Please verify your email OTP before logging in' });
        }

        // yadi user hai aur saath mein usne jo password daala hai wo bhi sahi hai toh login karne do warna invalid email or password ka message bhejdo.

        if(user && (await bcrypt.compare(password, user.password))){
            // yadi sab sahi hai toh client(react-frontedn) ko json format mein data bhejdo.
            res.json({
                _id:user._id,
                name : user.name,
                email : user.email,
                role : user.role,
                token : generateToken(user._id)
            })
        }else{
            res.status(401).json({message : 'Invalid email or password'});
        }
    }catch(error){
        res.status(500).json({message: error.message});
    }
};

// FUNCTION OF RETRIEVING ALL USERS : 
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, verifyOtp, getUsers };
