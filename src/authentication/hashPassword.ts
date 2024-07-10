import express from 'express';
import bycryptjs from 'bcryptjs';

const hashPassword = async(password: string, res: express.Response) => {
    try {
        const passwordHash= await bycryptjs.hash(password, 10);
        return passwordHash;
    } catch (error) {

        return res.status(500).json({
            message: error.message,
            error: error
        });

    }
 
}


export default hashPassword;