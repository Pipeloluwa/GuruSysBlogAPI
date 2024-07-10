import { UserModel } from '../../database/users';
import express from 'express';

export const userGetById = async (req: express.Request, res: express.Response) => {

    try {
        const user= await UserModel.findById(req.params.id).select('-password');
        if (!user){
            return res.status(404).send("This User can not be found")
        }
        
        return res.status(200).json(user).end();
        
    } catch (error) {
        return res.status(500).send("Something went wrong, please try agin later");
    }

}