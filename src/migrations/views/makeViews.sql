drop view if exists link_stats_view;
create view link_stats_view as 
select stats.id, stats.short_link, stats.long_link, stats.created_at, stats.view_count, stats.creator_uuid,
       jsonb_object_agg(distinct browser, browser_percent) browsers,
       jsonb_object_agg(distinct device, device_percent) devices
from (
         select distinct link.*,
                         link_id,
                         coalesce(lv.user_browser ->> 'name', 'other') browser,
                         coalesce(lv.device, 'other') device,
                         count(*) filter (where lv.link_id is not null) over (partition by lv.link_id)::int view_count,
                         (count(*) filter (where lv.link_id is not null) over (partition by lv.user_browser ->> 'name', lv.link_id))::int browser_percent,
                         (count(*) filter (where lv.link_id is not null) over (partition by lv.device, lv.link_id))::int  device_percent
         from links link 
              left join link_views lv
         on link.id = lv.link_id
     ) stats

group by 1, 2, 3, 4, 5, 6;
