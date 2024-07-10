import { UserModel } from '../../database/users';
import express from 'express';
import hashPassword from '../../authentication/hashPassword';

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {

        const current_user= res.locals.jwt;
       
        await UserModel.findOneAndDelete(
            {email: current_user.email}
        ).then(()=> {
            return res.send(201).send("Deleted successfully");
        }).catch((error) => {
            console.log(error);
            return res.send(500).send("Soething went wrong");
        });
      


        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}