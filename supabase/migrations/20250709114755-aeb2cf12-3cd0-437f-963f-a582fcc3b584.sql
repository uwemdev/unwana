-- Create simple, working RLS policies

-- Users table policies
CREATE POLICY "Users can view all profiles" ON public.users
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
FOR UPDATE USING (auth_user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.users
FOR INSERT WITH CHECK (auth_user_id = auth.uid());

-- Posts table policies
CREATE POLICY "Anyone can view posts" ON public.posts
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.posts
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can update their own posts" ON public.posts
FOR UPDATE USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can delete their own posts" ON public.posts
FOR DELETE USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Post likes policies
CREATE POLICY "Anyone can view post likes" ON public.post_likes
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like posts" ON public.post_likes
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can remove their own likes" ON public.post_likes
FOR DELETE USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Post comments policies
CREATE POLICY "Anyone can view post comments" ON public.post_comments
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create post comments" ON public.post_comments
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can update their own post comments" ON public.post_comments
FOR UPDATE USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can delete their own post comments" ON public.post_comments
FOR DELETE USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Votes policies
CREATE POLICY "Anyone can view votes" ON public.votes
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create votes" ON public.votes
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can update their own votes" ON public.votes
FOR UPDATE USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Comments policies (for scan comments)
CREATE POLICY "Anyone can view comments" ON public.comments
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can update their own comments" ON public.comments
FOR UPDATE USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can delete their own comments" ON public.comments
FOR DELETE USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Wallet sessions policies
CREATE POLICY "Users can view their own sessions" ON public.wallet_sessions
FOR SELECT USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Users can create their own sessions" ON public.wallet_sessions
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (
  user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);