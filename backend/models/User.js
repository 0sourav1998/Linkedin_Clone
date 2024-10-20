import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true ,
    },
    username : {
        type : String ,
        required : true
    },
    email : {
        type : String ,
        required : true ,
        unique : true
    },
    password: {
        type : String ,
        required : true
    },
    profilePicture  :{ 
        type : String ,
        default : "" 
    },
    bannerImage : {
        type : String ,
        default : ""
    },
    headline : {
        type : String,
        default : "Linkedin User"
    },
    location : {
        type : String,
        default : ""
    },
    skills : [String],
    about : {
        type : String,
        default : ""
    },
    experience : [{
        title: String ,
        company : String ,
        from : Date ,
        to : Date,
        description : String
    }],
    education : [{
        school : String,
        fieldOfStudy : String ,
        from : Date ,
        to : Date 
    }],
    connections : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
    }]
},{timestamps : true});

const User = mongoose.model("User",userSchema);
export default User ;