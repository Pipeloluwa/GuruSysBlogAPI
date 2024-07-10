import mongoose, { Schema } from "mongoose";

const UserSchema= new mongoose.Schema(
    {
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        blogs: [{type: Schema.Types.ObjectId, ref: 'Blog'}]
    },

    {
        timestamps: true
    }

);


export const UserModel= mongoose.model('User', UserSchema);

