import { expect } from 'chai';
import { testAddEntity, testPost, testRouteExists, testFieldValidation, testRequiredField, truncateTables, testGetEntity, testAuthentication } from './utils/helpers';
import { getLinkbyHash, insertUser, insertNewLink } from '../services/db/dal';
import { TEST_USER } from './utils/constants';

const sampleLink = {
  long_link: 'https://yektanet.com'
};

const sampleShortLink = {
  short_link: 'localhost:3005/r/mjOhCbV3j',
  long_link: 'https://yektanet.com',
  hash: 'mjOhCbV3j',
  creator_uuid: TEST_USER.user_uuid,
};

describe('links controller ', () => {
  beforeEach(async () => {
    await truncateTables('links');
  });
  describe('POST /shorten', () => {
    const route = '/rest/links/shorten';

    testRouteExists('post', route);
    testAuthentication('post', route, sampleLink);
    testFieldValidation('post', route, 'long_link', sampleLink, 'asdf', 'user');
    testRequiredField('post', route, 'long_link', sampleLink, 'user');

    it ('should add a new short link', async () => {
      const res = await testAddEntity(route, sampleLink, 'user');
      expect(res.short_link).not.eq(undefined);

      const insertedLink = await getLinkbyHash(res.short_link.split('r/')[1]);
      expect(insertedLink).not.eq(undefined);
      expect(insertedLink.long_link).eq(sampleLink.long_link);
    });
  });

});
