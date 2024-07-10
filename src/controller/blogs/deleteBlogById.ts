import express from 'express';
import { BlogModel } from '../../database/blog';
import logger from '../../config/logger';
import { UserModel } from '../../database/users';



export const deleteBlogById= async(req: express.Request, res: express.Response) => {
    try{

        const { blogId }= req.params;
        const current_user= res.locals.jwt;

        try {console.log("Here");
            logger.info("Deleting ...");

            UserModel.findOne({email: current_user.email, blogs: blogId})
                .exec() 
                .then((userModelResult) => {
                    
                    return BlogModel.findByIdAndDelete(blogId)
                        .then(() => {
                            UserModel.findByIdAndUpdate(userModelResult._id, { $pull: {blogs: { $in: blogId}}});

                            logger.info("Deleted successfully...");
                            return res.status(201).send("Deleted successfully");
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