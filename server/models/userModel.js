import mongoose from "mongoose"

const userSechema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type:String, default: ""},
    verifyOtpExpaireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ""},
    resetOtpExpaireAt: {type: Number, default: 0}


})

const userModel = mongoose.models.users ||mongoose.model("users", userSechema)

export default userModel;