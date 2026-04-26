-- Supabase上で実行するSQL
-- 1. postsテーブルの作成
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  user_email text not null,
  content text not null,
  created_at timestamptz default now() not null
);

-- 2. Row Level Security を有効化
alter table public.posts enable row level security;

-- 3. 誰でも読める（ログイン不要で閲覧可）
create policy "Anyone can read posts"
  on public.posts for select
  using (true);

-- 4. ログイン済みユーザーのみ投稿可
create policy "Authenticated users can insert"
  on public.posts for insert
  to authenticated
  with check (true);

-- 5. リアルタイム通知を有効化
alter publication supabase_realtime add table public.posts;
