import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js';
import authSeller from '../middleware/authSeller.js';

const sellerRouter = express.Router();

sellerRouter.post('/login', sellerLogin);
sellerRouter.post('/is-auth', authSeller, isSellerAuth);
sellerRouter.post('/logout', sellerLogout);


export default sellerRouter;
