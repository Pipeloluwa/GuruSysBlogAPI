import express from 'express';
import logger from '../../config/logger';
import { UserModel } from '../../database/users';



export const getBlogByUserAll= async(req: express.Request, res: express.Response) => {

    try{

        try {
            UserModel.find()
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