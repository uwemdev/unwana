-- Drop all policies that depend on the function first
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can like posts" ON public.post_likes;
DROP POLICY IF EXISTS "Users can remove their own likes" ON public.post_likes;
DROP POLICY IF EXISTS "Authenticated users can create post comments" ON public.post_comments;
DROP POLICY IF EXISTS "Users can update their own post comments" ON public.post_comments;
DROP POLICY IF EXISTS "Users can delete their own post comments" ON public.post_comments;
DROP POLICY IF EXISTS "Users can create their own sessions" ON public.wallet_sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.wallet_sessions;
DROP POLICY IF EXISTS "Authenticated users can create votes" ON public.votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON public.votes;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;

-- Now drop the function
DROP FUNCTION IF EXISTS public.get_user_by_auth_uid();

-- Add auth_user_id column to users table to link with Supabase auth
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_user_id uuid REFERENCES auth.users(id);