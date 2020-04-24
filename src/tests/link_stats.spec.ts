import { expect } from 'chai';
import { testAddEntity, testPost, testRouteExists, testFieldValidation, testRequiredField, truncateTables, testGetEntity, testAuthentication } from './utils/helpers';
import { getLinkbyHash, insertUser, insertNewLink, insertNewLinkView } from '../services/db/dal';
import { TEST_USER } from './utils/constants';
import { LinkViews } from '../entities/LinkViews';

const sampleFilter = {
  filters: {

  }
};

const sampleShortLink = {
  id: 9999,
  short_link: 'localhost:3005/r/mjOhCbV3j',
  long_link: 'https://yektanet.com',
  hash: 'mjOhCbV3j',
  creator_uuid: TEST_USER.user_uuid,
};

const sampleLinkView : Partial<LinkViews> = {
  link_id: sampleShortLink.id,
  device: 'desktop',
  user_browser: {name: 'Chrome'},
};

describe('link stats controller ', () => {
  beforeEach(async () => {
    await truncateTables('links', 'link_views');
  });
  describe('POST /', () => {
    const route = '/rest/link_stats';

    testRouteExists('post', route);
    testAuthentication('post', route, sampleFilter);
    testFieldValidation('post', route, 'filters', sampleFilter, 'asdf', 'user');
    testRequiredField('post', route, 'filters', sampleFilter, 'user');


    it('should return link stats', async () => {
      await insertNewLink(sampleShortLink);
      await insertNewLinkView(sampleLinkView);
      

      const res = await testAddEntity(route, sampleFilter, 'user');
      expect(res).not.eq(undefined);
      expect(res).be.an('array');
      expect(res[0].id).eq(sampleShortLink.id);
      expect(res[0].view_count).eq(1);
      expect(res[0].devices.desktop).eq(1);

    });
  });

});
