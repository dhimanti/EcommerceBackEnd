import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema( {
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        unique : true,
        require : true
    },
    password : {
        type : String,
        require : true
    },
    re_password : {
        type : String,
        require : true
    }
})

const UserModel = mongoose.model("customers", CustomerSchema);
export default UserModel;