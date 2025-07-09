-- Update RLS policies to work with proper Supabase auth

-- Drop existing policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
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

-- Create function to get user by auth uid
CREATE OR REPLACE FUNCTION public.get_user_by_auth_uid()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT id FROM public.users 
    WHERE wallet_address = (auth.uid())::text
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table policies
CREATE POLICY "Users can update their own profile" ON public.users
FOR UPDATE USING (
  wallet_address = (auth.uid())::text
);

CREATE POLICY "Users can view all profiles" ON public.users
FOR SELECT USING (true);

-- Posts table policies
CREATE POLICY "Authenticated users can create posts" ON public.posts
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND user_id = get_user_by_auth_uid()
);

CREATE POLICY "Users can update their own posts" ON public.posts
FOR UPDATE USING (user_id = get_user_by_auth_uid());

CREATE POLICY "Users can delete their own posts" ON public.posts
FOR DELETE USING (user_id = get_user_by_auth_uid());

-- Post likes policies
CREATE POLICY "Authenticated users can like posts" ON public.post_likes
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND user_id = get_user_by_auth_uid()
);

CREATE POLICY "Users can remove their own likes" ON public.post_likes
FOR DELETE USING (user_id = get_user_by_auth_uid());

-- Post comments policies
CREATE POLICY "Authenticated users can create post comments" ON public.post_comments
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND user_id = get_user_by_auth_uid()
);

CREATE POLICY "Users can update their own post comments" ON public.post_comments
FOR UPDATE USING (user_id = get_user_by_auth_uid());

CREATE POLICY "Users can delete their own post comments" ON public.post_comments
FOR DELETE USING (user_id = get_user_by_auth_uid());

-- Wallet sessions policies
CREATE POLICY "Users can create their own sessions" ON public.wallet_sessions
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND user_id = get_user_by_auth_uid()
);

CREATE POLICY "Users can view their own sessions" ON public.wallet_sessions
FOR SELECT USING (user_id = get_user_by_auth_uid());

-- Votes policies
CREATE POLICY "Authenticated users can create votes" ON public.votes
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND user_id = get_user_by_auth_uid()
);

CREATE POLICY "Users can update their own votes" ON public.votes
FOR UPDATE USING (user_id = get_user_by_auth_uid());

-- Comments policies
CREATE POLICY "Authenticated users can create comments" ON public.comments
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND user_id = get_user_by_auth_uid()
);

CREATE POLICY "Users can update their own comments" ON public.comments
FOR UPDATE USING (user_id = get_user_by_auth_uid());

CREATE POLICY "Users can delete their own comments" ON public.comments
FOR DELETE USING (user_id = get_user_by_auth_uid());

-- Notifications policies
CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (user_id = get_user_by_auth_uid());

CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (user_id = get_user_by_auth_uid());