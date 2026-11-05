create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('farmer','buyer','supplier','admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'listing_status') then
    create type public.listing_status as enum ('active','pending','sold','removed');
  end if;
  if not exists (select 1 from pg_type where typname = 'task_priority') then
    create type public.task_priority as enum ('low','normal','high');
  end if;
  if not exists (select 1 from pg_type where typname = 'report_status') then
    create type public.report_status as enum ('open','reviewing','resolved','dismissed');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 100),
  role public.app_role not null default 'farmer',
  location text,
  farm_type text,
  interests text[] not null default '{}',
  business_name text,
  bio text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  category text not null,
  description text not null,
  price numeric(14,2) not null check (price > 0),
  currency text not null default 'USD' check (currency in ('USD','ZWL')),
  quantity numeric(14,2) not null check (quantity > 0),
  unit text not null,
  location text not null,
  status public.listing_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_status_created_idx on public.products(status,created_at desc);
create index products_seller_idx on public.products(seller_id,created_at desc);
create index products_category_location_idx on public.products(category,location);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null unique,
  alt_text text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);
create index product_images_product_idx on public.product_images(product_id,sort_order);

create table public.farming_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 160),
  description text,
  due_at timestamptz,
  priority public.task_priority not null default 'normal',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index farming_tasks_user_due_idx on public.farming_tasks(user_id,due_at);

create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Farming question',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index ai_conversations_user_updated_idx on public.ai_conversations(user_id,updated_at desc);
create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null check (char_length(content) <= 10000),
  created_at timestamptz not null default now()
);
create index ai_messages_conversation_created_idx on public.ai_messages(conversation_id,created_at);

create table public.market_prices (
  id uuid primary key default gen_random_uuid(),
  crop text not null,
  market text not null,
  price numeric(14,2) not null check (price > 0),
  currency text not null check (currency in ('USD','ZWL')),
  source text not null,
  observed_on date not null,
  submitted_by uuid references public.profiles(id) on delete set null,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
create index market_prices_crop_observed_idx on public.market_prices(crop,observed_on desc);
create index market_prices_market_observed_idx on public.market_prices(market,observed_on desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  kind text not null default 'general',
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_unread_idx on public.notifications(user_id,created_at desc) where read_at is null;

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  content_type text not null default 'product',
  reason text not null,
  details text,
  status public.report_status not null default 'open',
  moderator_note text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (product_id is not null or content_type <> 'product')
);
create index reports_status_created_idx on public.reports(status,created_at desc);

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create or replace function public.touch_conversation_from_message() returns trigger language plpgsql security definer set search_path = '' as $$
begin update public.ai_conversations set updated_at=now() where id=new.conversation_id; return new; end; $$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'::public.app_role);
$$;
create or replace function public.prevent_role_escalation() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only an administrator can change account roles';
  end if;
  new.updated_at = now();
  return new;
end; $$;
create or replace function public.prevent_listing_self_approval() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.status='active' and old.status is distinct from new.status and not public.is_admin() then
    raise exception 'Only an administrator can approve a listing';
  end if;
  new.updated_at=now();
  return new;
end; $$;
create trigger profiles_prevent_role_escalation before update on public.profiles for each row execute function public.prevent_role_escalation();
create trigger products_touch_updated before update on public.products for each row execute function public.touch_updated_at();
create trigger products_prevent_self_approval before update on public.products for each row execute function public.prevent_listing_self_approval();
create trigger tasks_touch_updated before update on public.farming_tasks for each row execute function public.touch_updated_at();
create trigger conversations_touch_updated before update on public.ai_conversations for each row execute function public.touch_updated_at();
create trigger reports_touch_updated before update on public.reports for each row execute function public.touch_updated_at();
create trigger ai_messages_touch_conversation after insert on public.ai_messages for each row execute function public.touch_conversation_from_message();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,full_name,role,location)
  values(new.id,coalesce(new.raw_user_meta_data->>'full_name','FarmLink member'),
    case when new.raw_user_meta_data->>'role' in ('farmer','buyer','supplier') then (new.raw_user_meta_data->>'role')::public.app_role else 'farmer'::public.app_role end,
    new.raw_user_meta_data->>'location') on conflict(id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.farming_tasks enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.market_prices enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;

create policy "Profiles visible to public" on public.profiles for select using (true);
create policy "Users update own profile" on public.profiles for update using (id=(select auth.uid())) with check (id=(select auth.uid()));
create policy "Admins update profiles" on public.profiles for update using (public.is_admin()) with check (public.is_admin());
create policy "Products visible when active or owned" on public.products for select using (status='active' or seller_id=(select auth.uid()) or public.is_admin());
create policy "Farmers and suppliers create listings" on public.products for insert with check (seller_id=(select auth.uid()) and (select role from public.profiles where id=(select auth.uid())) in ('farmer','supplier'));
create policy "Owners update listings" on public.products for update using (seller_id=(select auth.uid()) or public.is_admin()) with check (seller_id=(select auth.uid()) or public.is_admin());
create policy "Owners delete listings" on public.products for delete using (seller_id=(select auth.uid()) or public.is_admin());
create policy "Product images visible with listing" on public.product_images for select using (exists(select 1 from public.products p where p.id=product_id and (p.status='active' or p.seller_id=(select auth.uid()) or public.is_admin())));
create policy "Owners manage product images" on public.product_images for all using (exists(select 1 from public.products p where p.id=product_id and p.seller_id=(select auth.uid()))) with check (exists(select 1 from public.products p where p.id=product_id and p.seller_id=(select auth.uid())));
create policy "Users manage own tasks" on public.farming_tasks for all using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy "Users manage own conversations" on public.ai_conversations for all using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy "Users manage own messages" on public.ai_messages for all using (exists(select 1 from public.ai_conversations c where c.id=conversation_id and c.user_id=(select auth.uid()))) with check (exists(select 1 from public.ai_conversations c where c.id=conversation_id and c.user_id=(select auth.uid())));
create policy "Verified market prices public" on public.market_prices for select using (verified=true);
create policy "Admins manage market prices" on public.market_prices for all using (public.is_admin()) with check (public.is_admin());
create policy "Users manage own notifications" on public.notifications for all using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create policy "Users create reports" on public.reports for insert with check (reporter_id=(select auth.uid()));
create policy "Reporters and admins view reports" on public.reports for select using (reporter_id=(select auth.uid()) or public.is_admin());
create policy "Admins manage reports" on public.reports for update using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do nothing;
create policy "Public can view product images" on storage.objects for select using (bucket_id='product-images');
create policy "Signed in users upload own product images" on storage.objects for insert to authenticated with check (bucket_id='product-images' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Owners update their product images" on storage.objects for update to authenticated using (bucket_id='product-images' and (storage.foldername(name))[1]=(select auth.uid())::text) with check (bucket_id='product-images' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Owners delete their product images" on storage.objects for delete to authenticated using (bucket_id='product-images' and (storage.foldername(name))[1]=(select auth.uid())::text);
