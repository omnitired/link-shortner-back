import { Router } from 'express';
import { schemaValidator } from '../middlewares/schemaValidator';
import { signupUser } from '../services/auth/authentication';
import { authenticate } from '../services/auth/passport';
import { linkStats, singleLinkStats } from '../services/linkStats/linkStats';

const router = Router();


router.post('/',
  authenticate,
  schemaValidator('link_stats'),
  linkStats,
);
router.post('/:id',
  authenticate,
  schemaValidator('link_stats'),
  singleLinkStats,
);

export default router;
