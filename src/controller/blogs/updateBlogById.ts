import express from 'express';
import { BlogModel } from '../../database/blog';
import logger from '../../config/logger';
import { pictureUpload } from '../../cloud_upload/pictureUpload';
import { UserModel } from '../../database/users';
const fs = require('fs').promises;



export const updateBlogById= async(req: express.Request, res: express.Response) => {

    try{

        const { blogId }= req.params;

        const current_user= res.locals.jwt;
        const bodyToJson= await JSON.parse(req.body.jsonContents)
        const {title, content }= bodyToJson;

        const updateContent= new Map<string, string>();
        if (title){
            updateContent.set('title', title);
        }

        if (content){
          updateContent.set('content', content);  
        }
    



        try {
            const updateContentJson= Object.fromEntries(updateContent);

            UserModel.findOne({email: current_user.email, blogs: blogId})
                .exec() 
                .then((foundedResult) => {
                    if (!foundedResult){
                        return res.status(404).send("This data has either been deleted or does not exist");
                    }


                    return BlogModel.findByIdAndUpdate(
                            blogId,
                            updateContentJson,
                            {new: true} // This option returns the updated document
                        )
                        .then( async(result) => {
                            if (!result){
                                return res.status(404).send("This data has either been deleted or does not exist");
                            }

                            
                            if (req.file){
                                const file_path= req.file.path;
                                const file_name= (req.file.filename).split(`.${req.file.mimetype.split('/')[1]}`)[0];
                        
                                const file_url= await pictureUpload(file_path, file_name, res);
                                
                                result.picture= file_url;
                                result.save();
                                logger.info("Updated successfully");
                                
                                // Remove the file from the directory after use
                                try {
                                    logger.info("Deleting file from directory...");
                                    await fs.unlink(file_path);
                                    logger.info("File deleted from directory succesfully");
                                } catch (err) {
                                    logger.info('Error deleting file:', err);
                                }
                            }

                        
                            return res.status(200).json(result);
                        })
                        
                        .catch((error) => {
                            return res.status(404).json({
                                message: error.message,
                                error
                            });
                        });

                })
                
                .catch((error) => {
                    return res.status(404).json({
                        message: error.message,
                        error
                    });
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