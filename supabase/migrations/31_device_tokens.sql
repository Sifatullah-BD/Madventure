create table if not exists device_tokens (
  id uuid default gen_random_uuid() primary key,
  token text not null unique,
  created_at timestamp with time zone default now()
);
