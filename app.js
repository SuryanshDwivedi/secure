//jshint esversion:6
const express=require("express");
const mongoose=require("mongoose");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const encrypt=require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema=mongoose.Schema({
  email:String,
  password:String
})
const secret="Thisismysecret";
userSchema.plugin(encrypt,{secret:secret,encryptedFeilds:['password']});
const User=mongoose.model("User",userSchema);

const app=express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("home");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.get("/register",function(req,res){
  res.render("register");
})
app.post("/login",function(req,res){
User.findOne({email:req.body.username},function(err,founduser){
  if(err){
    console.log(err);
  }
  else {
    if(founduser){
      if(founduser.password===req.body.password)
      {
        res.render("secrets")
      }
    }
  }
})

})


app.post("/register",function(req,res){
const user=req.body.username;
const pass=req.body.password;
const item=new User({
  email:user,
  password:pass
})
item.save();
  res.render("secrets");
})



app.listen(3000,function(){
  console.log("Server started");
})
