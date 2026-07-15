-- ATSデモ スキーマ
-- Supabase SQL Editor で実行するか、supabase db push で適用

-- 求人
create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,                -- 職種名
  employment_type text not null,      -- 正社員/契約社員/アルバイト
  location text,
  salary_range text,
  description text,
  status text not null default '公開中', -- 公開中/停止
  created_at timestamptz default now()
);

-- 候補者
create table if not exists candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kana text,
  email text,
  phone text,
  job_id uuid references jobs(id),
  source text not null,               -- 求人媒体/人材紹介/リファラル/直接応募
  stage text not null default '応募',  -- 応募/書類選考/一次面接/最終面接/内定/入社/不採用/辞退
  resume_filename text,
  applied_at date not null,
  created_at timestamptz default now()
);

-- メモ
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  author text not null default '採用担当',
  body text not null,
  created_at timestamptz default now()
);

-- 選考履歴
create table if not exists stage_history (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  from_stage text,
  to_stage text not null,
  changed_at timestamptz default now()
);

-- デモ用: RLSは全許可
alter table jobs enable row level security;
alter table candidates enable row level security;
alter table notes enable row level security;
alter table stage_history enable row level security;

create policy "allow all" on jobs for all using (true) with check (true);
create policy "allow all" on candidates for all using (true) with check (true);
create policy "allow all" on notes for all using (true) with check (true);
create policy "allow all" on stage_history for all using (true) with check (true);
