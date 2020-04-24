import { getLinkStats, getSingleLinkStats } from '../db/dal';

export const linkStats = async (req, res, next) => {
  const {filters} = req.body;
  const {user_uuid} = req.user;
  filters.creator_uuid = user_uuid;

  const stats = await getLinkStats(filters);

  res.json({
    data: stats
  });
};
export const singleLinkStats = async (req, res, next) => {
  const {filters} = req.body;
  const {user_uuid} = req.user;
  const id = req.params.id;
  filters.creator_uuid = user_uuid;
  filters.link_id = id;

  const stats = await getSingleLinkStats(filters);

  res.json({
    data: stats
  });
};
