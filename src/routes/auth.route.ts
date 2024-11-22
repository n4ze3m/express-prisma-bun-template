import { Router } from 'express';
import { loginController } from '../controllers/auth.controller';
import { validateData } from '../middlewares/validateData';
import { loginSchema } from '../schema/auth.schema';

const router = Router();

// POST /api/v1/auth/login
// valdiateData will validate the request body against the loginSchema
// if the request body is valid, it will call the loginController function
router.post('/login', validateData(loginSchema), loginController);

export default router;
