import express from 'express';
import multer from 'multer';
import { registerUser } from './controller/users/userRegister';
import { userGetById } from './controller/users/userGetById';
import { addBlog } from './controller/blogs/addBlog';
import { getBlogByUser } from './controller/blogs/getBlogByUser';
import { getBlogByUserAll } from './controller/blogs/getBlogByUserAll';
import { getBlogById } from './controller/blogs/getBlogById';
import { getBlogByAll } from './controller/blogs/getBlogByAll';
import { updateBlogById } from './controller/blogs/updateBlogById';
import { deleteBlogById } from './controller/blogs/deleteBlogById';

import authentication_controller from './authentication/authentication_controller';
import extractJWT from './authentication/middleware/extractJWT';
import { updatePassword } from './controller/users/passwordUpdate';
import { deleteUser } from './controller/users/userDelete';

const router= express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const fileType= file.mimetype.split('/')[1];
      cb(null, file.fieldname + '-' + uniqueSuffix + "." + fileType)
    }
  })
  
const upload = multer({ storage })



export function AppRouter (): express.Router {
    router.get('/auth/validate', extractJWT, authentication_controller.validateToken)
    router.post('/auth/login', authentication_controller.login);
    
    router.post('/user/register', registerUser);
    router.get('/user/:id', extractJWT, userGetById)
    router.put('/user/update', extractJWT, updatePassword)
    router.delete('/user/delete', extractJWT, deleteUser)

    router.post('/blog/add', extractJWT, upload.single('file'), addBlog);
    router.get('/blog/get-by-user', extractJWT, getBlogByUser);
    router.get('/blog/get-by-user-all', extractJWT, getBlogByUserAll);
    router.get('/blog/get-by-id/:blogId', extractJWT, getBlogById);
    router.get('/blog/get-by-all', getBlogByAll);
    router.put('/blog/update-by-id/:blogId', extractJWT, upload.single('file'), updateBlogById);
    router.delete('/blog/delete-by-id/:blogId', extractJWT, deleteBlogById);
    
    return router;
}