import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
    type: String,
    required: true,
    unique: true,
},
fullName:{
    type: String,
    required: true,
},
password:{
    type: String,
    required: true,
    minLength: 6,

},
email:{
    type: String,
    required: true,
    unique: true
},

followers:[ // Followers are an array that is empty in the beginning of creating the account
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default:[]
}
],
following:[ // Followings are an array that is empty in the beginning of creating the account
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default:[]
}
],

profileImg:{
    type: String,
    default: ","
},
bio:{
    type:String,
    default: "",
},
link:{
    type: String,
    default: "",
}

}, {timestamps: true}
);

const User = mongoose.model("User", userSchema);
export default User;