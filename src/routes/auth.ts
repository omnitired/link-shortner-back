import { Router } from 'express';
import { schemaValidator } from '../middlewares/schemaValidator';
import { signupUser, loginUser } from '../services/auth/authentication';

const router = Router();


router.post('/signup',
  schemaValidator('signup'),
  signupUser,
);
router.post('/login',
  schemaValidator('login'),
  loginUser,
);

export default router;
