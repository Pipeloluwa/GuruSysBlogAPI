import express from 'express';
import { BlogModel } from '../../database/blog';
import logger from '../../config/logger';
import { pictureUpload } from '../../cloud_upload/pictureUpload';
import { UserModel } from '../../database/users';
const fs = require('fs').promises;


export const addBlog= async(req: express.Request, res: express.Response) => {

    try{

        const current_user= res.locals.jwt;
        const bodyToJson= await JSON.parse(req.body.jsonContents)
        const {title, content }= bodyToJson;

        const file_path= req.file.path;
        const file_name= (req.file.filename).split(`.${req.file.mimetype.split('/')[1]}`)[0];

        const file_url= await pictureUpload(file_path, file_name, res);


        // Remove the file from the directory after use
        try {
            logger.info("Deleting file from directory...");
            await fs.unlink(file_path);
            logger.info("File deleted from directory succesfully");
        } catch (err) {
            logger.info('Error deleting file:', err);
        }


        const _blog= new BlogModel({
            title,
            content,
            writer: current_user.username,
            picture: file_url
        });


        try {
            UserModel.findOne({email: current_user.email})
                .then(async (foundedUser) => {
                    
                    const savedBlog = await _blog.save();
                    foundedUser.blogs.push(savedBlog._id);
                    await foundedUser.save();

                    return res.status(201).json(savedBlog);
                })

                .catch((error) => {
                    return res.status(404).send("User not found");
                });

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            });
        }

    }

    catch(error){
        logger.info(error);
        console.log(error);
    }

}