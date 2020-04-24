import db from './db';
import { Link } from '../../entities/Link';
import { LinkViews } from '../../entities/LinkViews';
import { User } from '../../entities/User';
import { findSourceMap } from 'module';

export function getInsertQuery(entity, entity_name) {
  return `insert into ${entity_name} (${Object.keys(entity).join(',')}) values (${Array.from({length: Object.keys(entity).length}).map((v, i) => `$${i + 1}`)})`;
}

function getWhereQuery(findOptions) {
  return Object.keys(findOptions).map((key, index) => `${key} = $${index + 1}`).join(' and ');
}

export async function getLinkbyHash (hash: string) {
  const existinglink = await db.runQuery(`select * from links where hash = $1`, [hash]);
  return existinglink.rows[0];
}

export async function insertNewLink (link: Link) {
  await db.runQuery(getInsertQuery(link, 'links'), Object.values(link));
}

export async function insertNewLinkView (linkView: Partial<LinkViews>) {
  await db.runQuery(getInsertQuery(linkView, 'link_views'), Object.values(linkView));
}

export async function insertUser (user: Partial<User>) {
  await db.runQuery(getInsertQuery(user, 'users'), Object.values(user));
}
export async function getUserWithPassword (findOptions: Partial<User>) : Promise<User>{

  const whereQuery = getWhereQuery(findOptions);

  const res = await db.runQuery(`select * from users where ${whereQuery} and deleted_at is null`, Object.values(findOptions));
  return res.rows[0];
}

export async function getUser(uuid: string) {
  const res = await db.runQuery(`select user_uuid, email, username from users where user_uuid = $1`, [uuid]);
  return res.rows[0];
}

export async function getLinkStats (filters) {
  const whereQuery = getWhereQuery(filters);
  const res = await db.runQuery(`select * from link_stats_view where ${whereQuery} order by created_at desc`, Object.values(filters));
  return res.rows;
}
export async function getSingleLinkStats (filters) {
  let time_query = '';
  if (filters.time_range) {
    switch(filters.time_range) {
      case 'all': break;
      case 'today': time_query += ` and lv.created_at::date = now()::date`; break;
      case 'yesterday': time_query += ` and lv.created_at::date = now()::date - interval '1 day'`; break;
      case 'seven': time_query += ` and lv.created_at > now() - interval '7 days'`; break;
      case 'thirty': time_query += ` and lv.created_at = now() - interval '30 days'`; break;
    }
    delete filters.time_range;
  }

  const res = await db.runQuery(`
  select link_id, view_count,
  jsonb_object_agg(distinct browser, browser_percent) browsers,
  jsonb_object_agg(distinct device, device_percent)   devices
    from (
      select link_id, creator_uuid, lv.created_at,
            coalesce(lv.user_browser ->> 'name', 'other') browser,
            coalesce(lv.device, 'other') device,
            count(*) filter (where lv.link_id is not null)  over (partition by link_id)::int                            view_count,
            (count(*) filter (where lv.link_id is not null)  over (partition by user_browser ->> 'name', link_id))::int browser_percent,
            (count(*) filter (where lv.link_id is not null) over (partition by device, link_id))::int                  device_percent
      from links l
      left join link_views lv on lv.link_id = l.id
      where l.id = $1 and l.creator_uuid = $2 ${time_query}
    ) stats
  group by 1, 2;`,
  [filters.link_id, filters.creator_uuid]);
  return res.rows[0];
}
