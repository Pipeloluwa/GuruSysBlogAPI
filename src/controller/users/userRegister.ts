import { UserModel } from '../../database/users';
import express from 'express';
import hashPassword from '../../authentication/hashPassword';

export const registerUser = async (req: express.Request, res: express.Response) => {
    try {
        const {email, username, password} = req.body;
        
        if (!email || !password || !username){
            return res.status(400).send("All the fields are not filled");
        }

        const existingUser = await UserModel.findOne({email});
        if (existingUser){
            return res.status(409).send("User with this email already exist");
        }


        const passwordHash= await hashPassword(password, res);
        console.log(passwordHash);

        const _user= new UserModel({
            email,
            username, 
            password: passwordHash
        });

        try {
            const user = await _user.save();
            return res.status(201).json({ 
                _id: user.id,
                email: user.email,
                username: user.username,
                createdAt: user.createdAt
             });
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            });
        }
        
        


        
    } catch (error) {
        console.log(error);
        return res.status(400).send("Something went wrong");
    }
}