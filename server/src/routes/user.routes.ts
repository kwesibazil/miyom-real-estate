
import express from 'express';
import passport from 'passport';
import controller from '../controllers/user.controller';
import {upload} from '../configs/multer.config';

import { userMiddleware } from '../middleware/index.middleware';

const router = express.Router();

router.get('/login-failure', controller.loginFailure)
router.get('/login-success', controller.loginSuccess)
router.get('/investor/:investorId', userMiddleware.getAllInvestor, controller.findInvestorsDetails)

router.post('/logout',  controller.logout);
router.post('/register', userMiddleware.register, controller.register);
router.post('/login', userMiddleware.login, passport.authenticate('local', { failureRedirect: 'login-failure', successRedirect: 'login-success', failureFlash: true}));


router.put('/update', userMiddleware.updateInvestor, controller.updateInvestor);
router.put('/profile-image', userMiddleware.uploadProfileImg,  upload.single('image'), controller.uploadProfileImg);  
router.put('/update-password', userMiddleware.updatePassword, controller.updatePassword);

router.post('/set-password', userMiddleware.setPassword,  controller.updatePassword);

router.post('/reset-password', userMiddleware.resetPassword, controller.resetPassword);
router.post('/forgot-password', userMiddleware.forgotPassword, controller.emailJwtResetPasswordLink);


router.post('/register-test', controller.register);
export default router;


