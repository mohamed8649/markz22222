-- Training Center Database Schema (مشروع مركز التدريب)
-- Run this script in the Supabase SQL Editor

-- 1. Create Profiles Table (extends Supabase auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text not null,
    email text not null,
    role text default 'member' check (role in ('admin', 'member')),
    phone text,
    photo_url text,
    status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- 2. Create Courses Table
create table public.courses (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    instructor text,
    duration text,
    status text default 'active' check (status in ('active', 'inactive')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on courses
alter table public.courses enable row level security;

-- 3. Create Enrollments Table
create table public.enrollments (
    id uuid default gen_random_uuid() primary key,
    member_id uuid references public.profiles(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    enrollment_date date default current_date not null,
    status text default 'active' check (status in ('active', 'completed', 'cancelled')),
    grade text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (member_id, course_id)
);

-- Enable RLS on enrollments
alter table public.enrollments enable row level security;

-- 4. Create Certificates Table
create table public.certificates (
    id uuid default gen_random_uuid() primary key,
    certificate_number text unique not null,
    member_id uuid references public.profiles(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    issue_date date default current_date not null,
    grade text,
    pdf_url text,
    verification_token text unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on certificates
alter table public.certificates enable row level security;

-- 5. Create Memberships Table
create table public.memberships (
    id uuid default gen_random_uuid() primary key,
    membership_number text unique not null,
    member_id uuid references public.profiles(id) on delete cascade not null,
    start_date date default current_date not null,
    expiry_date date not null,
    status text default 'active' check (status in ('active', 'expired', 'suspended')),
    card_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on memberships
alter table public.memberships enable row level security;

---------------------------------------------------------
-- HELPER FUNCTIONS FOR SECURITY (To prevent infinite recursion)
---------------------------------------------------------

create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

---------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
---------------------------------------------------------

-- Profiles Policies
create policy "Allow public read access to profiles" 
    on public.profiles for select 
    using (true);

create policy "Allow users to update their own profile details" 
    on public.profiles for update 
    using (auth.uid() = id)
    with check (auth.uid() = id);

create policy "Allow admin full control over profiles" 
    on public.profiles for all 
    using (public.is_admin());

-- Courses Policies
create policy "Allow public read access to active courses" 
    on public.courses for select 
    using (true);

create policy "Allow admin full control over courses" 
    on public.courses for all 
    using (public.is_admin());

-- Enrollments Policies
create policy "Allow users to view their own enrollments" 
    on public.enrollments for select 
    using (auth.uid() = member_id);

create policy "Allow admin full control over enrollments" 
    on public.enrollments for all 
    using (public.is_admin());

-- Certificates Policies
create policy "Allow public read access to certificates (for verification)" 
    on public.certificates for select 
    using (true);

create policy "Allow admin full control over certificates" 
    on public.certificates for all 
    using (public.is_admin());

-- Memberships Policies
create policy "Allow public read access to memberships (for verification)" 
    on public.memberships for select 
    using (true);

create policy "Allow admin full control over memberships" 
    on public.memberships for all 
    using (public.is_admin());

---------------------------------------------------------
-- TRIGGERS & FUNCTIONS
---------------------------------------------------------

-- Automatically create profile row when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
declare
    default_role text := 'member';
begin
    -- If it's the very first user registering, make them an admin for convenience
    if not exists (select 1 from public.profiles) then
        default_role := 'admin';
    end if;

    insert into public.profiles (id, full_name, email, role, status)
    values (
        new.id, 
        coalesce(new.raw_user_meta_data->>'full_name', 'New Member'), 
        new.email, 
        default_role,
        case when default_role = 'admin' then 'approved' else 'pending' end
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
