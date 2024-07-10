import mongoose from "mongoose";

const BlogSchema= new mongoose.Schema(
    { 
        title: {type: String, required: true, length: 30},
        content: {type: String, required: true},
        writer: {type: String, required: true},
        picture: {type: String, required: true}
    },

    {
        timestamps: true
    }
);


export const BlogModel= mongoose.model('Blog', BlogSchema);
