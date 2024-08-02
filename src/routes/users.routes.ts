import express from 'express';
import * as userServices from '../controllers/users.controller';

const router = express.Router();

router.post('/register', userServices.register);
router.post('/login', userServices.login);

export default router;
