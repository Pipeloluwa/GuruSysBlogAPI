import express from 'express';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import logger from '../config/logger';
import dotenv from 'dotenv';

dotenv.config();


const CLOUDINARY_NAME= process.env.CLOUDINARY_NAME; 
const CLOUDINARY_API_KEY= process.env.CLOUDINARY_API_KEY;  
const CLOUDINARY_API_SECRET= process.env.CLOUDINARY_API_SECRET;



export const pictureUpload= async function(file_path: string, file_name: string, res: express.Response) {

    try{

        // Configuration
        cloudinary.config({ 
            cloud_name: CLOUDINARY_NAME, 
            api_key: CLOUDINARY_API_KEY, 
            api_secret: CLOUDINARY_API_SECRET 
        });

        

        logger.info("Uploading file...");
        // Upload an image
        const uploadResult= await cloudinary.uploader
            .upload(
                `${file_path}`, {
                    public_id: file_name,
                }
            )
            .catch((error) => {
                    logger.error(error);
                    console.log(error.message);

                    res.status(500).send("Could not upload the file, something went wrong");
            });
            
        
        logger.info("Uploaded file successfully...");

        const uploadResultResponse= (uploadResult as UploadApiResponse).url;
        console.log(uploadResultResponse);
        
        return uploadResultResponse;
        
    }


    catch(error){
        logger.error(error)
        res.status(500).send("Could not upload the file, something went wrong");
    }
       
}