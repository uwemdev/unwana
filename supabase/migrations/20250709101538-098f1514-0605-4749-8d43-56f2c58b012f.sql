-- Add random username generation and profile enhancements
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create function to generate random usernames
CREATE OR REPLACE FUNCTION generate_random_username()
RETURNS TEXT AS $$
DECLARE
    adjectives TEXT[] := ARRAY['Swift', 'Brave', 'Clever', 'Bright', 'Silent', 'Bold', 'Quick', 'Sharp', 'Noble', 'Wise', 'Strong', 'Fast', 'Smart', 'Cool', 'Epic'];
    nouns TEXT[] := ARRAY['Wolf', 'Eagle', 'Lion', 'Tiger', 'Hawk', 'Fox', 'Bear', 'Shark', 'Dragon', 'Falcon', 'Phoenix', 'Raven', 'Viper', 'Lynx', 'Panther'];
    username TEXT;
    counter INTEGER := 0;
BEGIN
    LOOP
        username := (adjectives[floor(random() * array_length(adjectives, 1) + 1)]::int) || 
                   (nouns[floor(random() * array_length(nouns, 1) + 1)]::int) || 
                   floor(random() * 9999 + 1)::text;
        
        -- Check if username already exists
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE username = username) THEN
            RETURN username;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            -- Fallback to ensure we don't loop forever
            username := 'User' || extract(epoch from now())::bigint || floor(random() * 1000)::text;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN username;
END;
$$ LANGUAGE plpgsql;

-- Create posts table for community posts
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0
);

-- Enable RLS for posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies for posts
CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT 
WITH CHECK (user_id = (SELECT id FROM public.users WHERE wallet_address = (auth.uid())::text));

CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE
USING (user_id = (SELECT id FROM public.users WHERE wallet_address = (auth.uid())::text));

CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE
USING (user_id = (SELECT id FROM public.users WHERE wallet_address = (auth.uid())::text));

-- Create post likes table
CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(post_id, user_id)
);

-- Enable RLS for post likes
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for post likes
CREATE POLICY "Anyone can view post likes" ON public.post_likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can like posts" ON public.post_likes FOR INSERT 
WITH CHECK (user_id = (SELECT id FROM public.users WHERE wallet_address = (auth.uid())::text));

CREATE POLICY "Users can remove their own likes" ON public.post_likes FOR DELETE
USING (user_id = (SELECT id FROM public.users WHERE wallet_address = (auth.uid())::text));

-- Create post comments table (separate from scan comments)
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for post comments
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for post comments
CREATE POLICY "Anyone can view post comments" ON public.post_comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create post comments" ON public.post_comments FOR INSERT 
WITH CHECK (user_id = (SELECT id FROM public.users WHERE wallet_address = (auth.uid())::text));

CREATE POLICY "Users can update their own post comments" ON public.post_comments FOR UPDATE
USING (user_id = (SELECT id FROM public.users WHERE wallet_address = (auth.uid())::text));

CREATE POLICY "Users can delete their own post comments" ON public.post_comments FOR DELETE
USING (user_id = (SELECT id FROM public.users WHERE wallet_address = (auth.uid())::text));

-- Create function to update post counts
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'post_likes' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE public.posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.post_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'post_comments' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE public.posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
        END IF;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for post counts
CREATE TRIGGER update_post_likes_count
    AFTER INSERT OR DELETE ON public.post_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_counts();

CREATE TRIGGER update_post_comments_count
    AFTER INSERT OR DELETE ON public.post_comments
    FOR EACH ROW EXECUTE FUNCTION update_post_counts();

-- Create trigger to generate username on user creation if not provided
CREATE OR REPLACE FUNCTION set_random_username()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.username IS NULL OR NEW.username = '' THEN
        NEW.username := generate_random_username();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_username_on_insert
    BEFORE INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION set_random_username();

-- Update existing users without usernames
UPDATE public.users SET username = generate_random_username() WHERE username IS NULL OR username = '';

-- Add updated_at triggers for new tables
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at
    BEFORE UPDATE ON public.post_comments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();