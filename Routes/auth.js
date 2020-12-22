const router = require("express").Router();
const User = require("../Modal/User");
const jwt=require('jsonwebtoken')
const {registerValidation,loginValidation} =require('./validation')
const bcrypt=require('bcryptjs')

router.post('/register',async(req,res)=>{
   const {error}=registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    //checking if usre is in already in 
    const emailExist=await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email Exist Already')

const salt=await bcrypt.genSalt(10)
const hashPassword=await bcrypt.hash(req.body.password,salt)


     

    const user=new User({
        name:req.body.name,
        email:req.body.email,
        password:hashPassword
    });
    try{
        const savedUser=await user.save();
        res.send({user:user._id})
    }
    catch(err){
        res.status(400).send(err)
    }

})
//Login
router.post('/login',async(req,res)=>{
    const {error}=loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const user=await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Email or Password Wrong')


    const validPass=await bcrypt.compare(req.body.password,user.password)
    if(!validPass) return res.status(400).send('Invalid Password')

    //create and assgn the token
    const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
    res.header('auth-token',token).send(token)

    res.send('done')
    //

})

module.exports = router;
