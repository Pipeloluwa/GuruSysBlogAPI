import { UserModel } from '../../database/users';
import express from 'express';
import hashPassword from '../../authentication/hashPassword';

export const updatePassword = async (req: express.Request, res: express.Response) => {
    try {
        const current_user= res.locals.jwt;
        const {password} = req.body;
        

        if (!password){
            return res.status(400).send("The password field is empty");
          }

        const passwordHash= (await hashPassword(password, res)).toString();
        const updateContentJson= {password: passwordHash};

        try {

            UserModel.findOneAndUpdate(
                {email: current_user.email},
                updateContentJson,
                {new: true}
            ).then(() => {
                return res.status(200).send("Updated successfully");
            }).catch((error) => {
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
        
        


        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}