import bcrypt from 'bcrypt';
import { User } from '../../entities/User';
import { v4 as uuid } from 'uuid';
import { insertUser } from '../../services/db/dal';
import { generateJWTToken } from '../../services/auth/authentication';
export const TEST_USER : Partial<User>= {
  user_uuid: uuid(),
  username: 'test',
  email: 'test@gmail.com',
  password: bcrypt.hashSync('12345678', 5),
};

const jwts = {};

export async function setJwts () {
  jwts['user'] = generateJWTToken({
    uid: TEST_USER.user_uuid!
  });
}

export function getJWT (role: string) {
  if (!role) return '';
  return jwts[role];
}

export async function addInitialData () {
  await insertUser(TEST_USER);
}
