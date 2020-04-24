import { generateHash } from './utils';
import { insertNewLink, getLinkbyHash, insertNewLinkView } from '../db/dal';
import { CustomError } from '../../utils/CustomerError';
import parser from 'ua-parser-js';
import { Link } from '../../entities/Link';
import { User } from '../../entities/User';

export const linkShortner = async (req, res, next) => {
  const { long_link } = req.body;
  const user : User = req.user;

  const hash = await generateHash();

  const short_link = `${process.env.BASE_SHORTNER_URL}/r/${hash}`;

  await insertNewLink({
    long_link,
    short_link,
    hash,
    creator_uuid: user.user_uuid
  });

  res.json({
    data: {
      short_link,
    }
  });
};

export const getLongLink = async (req, res, next) => {
  const { hash } = req.params;
  const existing : Link = await getLinkbyHash(hash);
  if (existing) {
    res.redirect(existing.long_link);
    const useragent = parser(req.headers['user-agent']);
    const remote_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    try {
      const device = useragent.device && useragent.device.type ? useragent.device.type : 'desktop';
      await insertNewLinkView({
        remote_ip,
        link_id: existing.id,
        device,
        user_os: useragent.os,
        user_browser: useragent.browser,
        user_device: useragent.device,
        user_cpu: useragent.cpu,
        user_engine: useragent.engine,
        user_agent: req.headers['user-agent'],
      });
    } catch (e) {}

  } else {
    next(new CustomError('Not found', 404));
  }

};
