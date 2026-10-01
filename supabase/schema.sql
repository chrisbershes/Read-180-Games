-- READ 180 Games cloud save schema
create table if not exists public.player_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  streak integer not null default 0,
  word_builder_score integer not null default 0,
  badges jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.player_progress enable row level security;

drop policy if exists "Players can read their own progress" on public.player_progress;
drop policy if exists "Players can insert their own progress" on public.player_progress;
drop policy if exists "Players can update their own progress" on public.player_progress;

create policy "Players can read their own progress"
on public.player_progress for select
using (auth.uid() = user_id);

create policy "Players can insert their own progress"
on public.player_progress for insert
with check (auth.uid() = user_id);

create policy "Players can update their own progress"
on public.player_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
