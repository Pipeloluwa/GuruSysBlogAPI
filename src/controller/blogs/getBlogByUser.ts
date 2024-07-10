import express from 'express';
import { BlogModel } from '../../database/blog';
import logger from '../../config/logger';
import { UserModel } from '../../database/users';



export const getBlogByUser= async(req: express.Request, res: express.Response) => {

    try{

        const current_user= res.locals.jwt.email;

        try {
            UserModel.findOne({email: current_user})
                .populate('blogs')
                .select('-password')
                .exec() 
                .then((foundedResult) => {
                    return res.status(200).json(foundedResult);

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