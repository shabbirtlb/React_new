require ("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require ("./db/conn")
const PORT = 6005;
const session = require("express-session");
const passport = require("passport");
const OAuth2Strat = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userschema");

const clientid = "823697821061-9hgqgjh09vn5tk9ulcrvr9asras6cc8p.apps.googleusercontent.com";
const clientsecret = "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"


app.use(cors({
    origin:"http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials:true
}));

app.use(express.json());
//setting up session 
app.use(session({
    secret:"4536",
    resave:false,
    saveUninitialized:true
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(
    new OAuth2Strat({
        clientID:clientid,
        clientSecret:clientsecret,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]
    },
    async(accessToken,refereshToken,profile,done)=>{
        console.log("profile",profile)
        try{
            let user = await userdb.findOne({googleID:profile.id});
            if (!user){
                user = new userdb({
                    googleID:profile.id,
                    displayName:profile.displayName,
                    email:profile.emails[0].value,
                    image:profile.photos[0].value
                });
                await user.save();
            }
            return done(null,user)
        }catch(error){
            return done(error,null)
        }
    }
    )
)

passport.serializeUser((user,done)=>{
    done(null,user);
})
passport.deserializeUser((user,done)=>{
    done(null,user);
});

app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));
app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:3000/recorder",
    failureRedirect:"https://localhost:3000/"
}))
app.get('/login/success',async(req,res)=>{
    console.log("req",req.user)
    if (req.user){
        res.status(200).json({message:"user login",user:req.user})
    }
    else{
        req.status(400).json({
            message:"Not authenticated"
        })
    }
})
app.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if (err){
            return next(err)
        }
        res.redirect("https://localhost:3000");
})})

const recordingSchema = new mongoose.Schema({
    language: String,
    transcript: String,
    filePath: String,
});
const Recording = mongoose.model('Recording', recordingSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.post('/saveRecording', upload.single('audio'), async (req, res) => {
    console.log(req);
    const { language, transcript } = req.body;
    const filePath = req.file.path;
    const newRecording = new Recording({ language, transcript, filePath });
    await newRecording.save();

    res.json({ message: 'Recording saved successfully', filePath });
});

app.listen(PORT,()=>{
    console.log(`Server Started at ${PORT}`)
})
