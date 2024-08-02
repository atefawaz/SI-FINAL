import express from 'express';
import * as profileServices from '../controllers/profile.controller';

const router = express.Router();

router.put('/', profileServices.editPassword);
router.post('/', profileServices.logout);

export default router;
