import { ExtractJwt, VerifiedCallback, Strategy as JwtStrategy } from 'passport-jwt';
import passport from 'passport';
import { IJwtPayload } from '../../entities/interfaces/IJwtPayload';
import { CustomError } from '../../utils/CustomerError';
import { getUser } from '../db/dal';


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const jwtCallBack = async (jwtPayload: IJwtPayload, done: VerifiedCallback) => {
  const uuid = jwtPayload.uid;

  if (!uuid) {
    return done(null, false);
  }

  let user;

  try {

    user = await getUser(uuid);

  } catch (err) {
    return done(null, false);
  }

  if (user) {
    return done(null, user);
  }

  return done(null, false);
};

passport.use(new JwtStrategy(jwtOptions, jwtCallBack));


export const authenticate = (req, res, next) => {
  return passport.authenticate('jwt', {session: false}, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(new CustomError('authentication_failed', 401));
    }
    
    req.user = user;

    return next();
  })(req, res, next);
};
