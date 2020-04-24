import { Router } from 'express';
import { schemaValidator } from '../middlewares/schemaValidator';
import { linkShortner, getLongLink } from '../services/link/linkServices';
import { authenticate } from '../services/auth/passport';

const router = Router();

router.post('/shorten',
  authenticate,
  schemaValidator('shorten'),
  linkShortner,
  );

router.get('/r/:hash', getLongLink);

export default router;
