import express from 'express';
import { BlogModel } from '../../database/blog';
import logger from '../../config/logger';
import { UserModel } from '../../database/users';



export const getBlogById= async(req: express.Request, res: express.Response) => {

    try{

        const { blogId }= req.params;

        try {
            BlogModel.findById(blogId)
                .then((result) => {
                    return res.status(200).json(result);
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