import { expect } from 'chai';
import { testAddEntity, testPost, testRouteExists, testFieldValidation, testRequiredField, truncateTables } from './utils/helpers';
import { getUser, getUserWithPassword, insertUser } from '../services/db/dal';
import { User } from '../entities/User';
import { v4 as uuid} from 'uuid';
import bcrypt from 'bcrypt';
import { addInitialData } from './utils/constants';

const sampleSignUp = {
  username: 'mbm1376',
  email: 'mbm1376@gmail.com',
  password: '12345678',
};
const sampleLogin = {
  password: '12345678',
  login_key: 'sample@gmail.com',
};

const sampleUser : Partial<User> = {
  user_uuid: uuid(),
  username: 'sample',
  password: '12345678',
  email: 'sample@gmail.com'
};

describe('auth controller ', () => {
  beforeEach(async () => {
    await truncateTables('users');
  });
  after(async () => {
    await truncateTables('users');
    await addInitialData();
  });
  describe('POST /signup', () => {
    const route = '/rest/auth/signup';

    testRouteExists('post', route);
    testFieldValidation('post', route, 'email', sampleSignUp, 'asdf.com');
    testRequiredField('post', route, 'username', sampleSignUp);

    it ('should create a new user', async () => {
      const response = await testPost(route, sampleSignUp);
      expect(response.token).not.eq(undefined);
      expect(response.user).not.eq(undefined);
      expect(response.user.username).eq(sampleSignUp.username);

      const insertedUser = await getUserWithPassword({username: sampleSignUp.username});
      expect(insertedUser).not.eq(undefined);
      expect(insertedUser.user_uuid).not.eq(undefined);
      expect(insertedUser.username).eq(sampleSignUp.username);
      expect(insertedUser.password).not.eq(sampleSignUp.password);
      expect(insertedUser.password).not.eq(sampleSignUp.password);
    });
  });

  describe('POST /login', () => {
    const route = '/rest/auth/login';

    testRouteExists('post', route);
    testRequiredField('post', route, 'login_key', sampleLogin);

    it ('should login and return token', async () => {
      let password = bcrypt.hashSync(sampleUser.password, 5);
      await insertUser({...sampleUser, password});

      const response = await testPost(route, sampleLogin);
      expect(response.token).not.eq(undefined);
      expect(response.user).not.eq(undefined);
      expect(response.user.email).eq(sampleLogin.login_key);
    });
  });

});
