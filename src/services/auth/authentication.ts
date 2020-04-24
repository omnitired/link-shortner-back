import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { IJwtPayload } from '../../entities/interfaces/IJwtPayload';
import { insertUser, getUserWithPassword } from '../db/dal';
import { v4 as uuid } from 'uuid';
import { User } from '../../entities/User';
import { CustomError } from '../../utils/CustomerError';

export function generateJWTToken(data: IJwtPayload) {
  return jwt.sign(data, process.env.JWT_SECRET as string, { expiresIn: '180 days', algorithm: 'HS256' });
}

export const signupUser = async (req, res, next) => {
  const { username, password, email } = req.body;

  const user_uuid = uuid();
  try {
    await insertUser({
      user_uuid,
      username,
      email,
      password: bcrypt.hashSync(password, 5),
    });
  } catch(e) {
    next(new CustomError(e.detail, 403));
    return;
  }
  const token = generateJWTToken({uid: user_uuid});
  
  res.json({
    data: {
      token,
      user: {
        username,
        user_uuid,
        email,
      }
    }
  });
};

export const loginUser = async (req, res, next) => {
  const {login_key, password} = req.body;
  let findOptions : Partial<User> = {};

  if (login_key.indexOf('@') > -1) {
    findOptions.email = login_key;
  } else {
    findOptions.username = login_key;
  }

  const user : User = await getUserWithPassword(findOptions);

  if (user && bcrypt.compareSync(password, user.password)) {
    delete user.password;

    const token = generateJWTToken({uid: user.user_uuid});
    res.json({
      data: {
        token,
        user,
      }
    });
  } else {
    next(new CustomError('username or password is wrong', 401));
  }

};
