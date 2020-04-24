create table users (
  user_uuid uuid primary key,
  verified boolean default false,
  email text not null unique,
  password text not null,
  username text not null unique, 
  created_at timestamptz default now(),
  deleted_at timestamptz
);

create table links (
  id serial primary key,
  long_link text,
  short_link text,
  hash text unique,
  creator_uuid uuid references users on delete cascade,
  created_at timestamptz default now()
);

create table link_views (
  id serial primary key,
  link_id int references links on delete cascade,
  user_agent text,
  remote_ip text,
  device text,
  user_os jsonb,
  user_device jsonb,
  user_cpu jsonb,
  user_engine jsonb,
  user_browser jsonb,
  created_at timestamptz default now()
);

-- index for not counting ip more than once in every 24 hours.
create unique index on link_views (remote_ip, link_id, date(timezone('UTC', created_at)));


create index short_link_idx on links(short_link);
