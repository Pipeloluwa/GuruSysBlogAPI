import express, { NextFunction } from "express";
import logger from "../config/logger";
import bycryptjs from 'bcryptjs';
import { UserModel } from "../database/users";
import signJWT from "./signJTW";

const NAMESPACE= "user";

const validateToken= async(req: express.Request, res: express.Response, next: NextFunction) => {

    logger.info(NAMESPACE, "Token validated, user authorized");

    return res.status(200).json({
        message: "Authorized"
    });

}



const login= async(req: express.Request, res: express.Response, next: NextFunction) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400);
    }

    UserModel.find({ email })
        .exec()
        .then( async(users) => {
            if (users.length !== 1) {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }


            const passwordHash= await bycryptjs.compare(password, users[0].password);
            
            if ( !passwordHash) {
                logger.info('Incorrect Password');
                console.log('Incorrect Password');
                return res.status(401).json({
                    message: 'Incorrect Password'
                });
            }


            try {
                
                signJWT(users[0], (_error, token) => {
                    if (_error) {
                        logger.info(_error);
                        return res.status(500).json({
                            message: _error.message,
                            error: _error
                        });
                    } else if (token) {
                        return res.status(200).json({
                            message: 'Auth successful',
                            token: token,
                            user_id: users[0]._id
                        });
                    }
                });

            } catch (error) {
                res.status(500).send(error);
            }
           
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    
}


export default {validateToken, login}