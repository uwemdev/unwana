-- Fix RLS policy for users table to allow SELECT
CREATE POLICY "Anyone can view user profiles" 
ON public.users 
FOR SELECT 
USING (true);

-- Update database functions to have proper search paths for security
CREATE OR REPLACE FUNCTION public.generate_random_username()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
    adjectives TEXT[] := ARRAY['Swift', 'Brave', 'Clever', 'Bright', 'Silent', 'Bold', 'Quick', 'Sharp', 'Noble', 'Wise', 'Strong', 'Fast', 'Smart', 'Cool', 'Epic'];
    nouns TEXT[] := ARRAY['Wolf', 'Eagle', 'Lion', 'Tiger', 'Hawk', 'Fox', 'Bear', 'Shark', 'Dragon', 'Falcon', 'Phoenix', 'Raven', 'Viper', 'Lynx', 'Panther'];
    new_username TEXT;
    counter INTEGER := 0;
BEGIN
    LOOP
        new_username := adjectives[floor(random() * array_length(adjectives, 1) + 1)::int] || 
                       nouns[floor(random() * array_length(nouns, 1) + 1)::int] || 
                       floor(random() * 9999 + 1)::text;
        
        -- Check if username already exists
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE username = new_username) THEN
            RETURN new_username;
        END IF;
        
        counter := counter + 1;
        IF counter > 100 THEN
            -- Fallback to ensure we don't loop forever
            new_username := 'User' || extract(epoch from now())::bigint || floor(random() * 1000)::text;
            EXIT;
        END IF;
    END LOOP;
    
    RETURN new_username;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_random_username()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF NEW.username IS NULL OR NEW.username = '' THEN
        NEW.username := generate_random_username();
    END IF;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_post_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.calculate_risk_score(scan_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  safe_votes INTEGER;
  scam_votes INTEGER;
  total_votes INTEGER;
  is_flagged BOOLEAN;
  risk_score INTEGER;
BEGIN
  -- Count votes
  SELECT 
    COUNT(*) FILTER (WHERE vote_type = 'safe'),
    COUNT(*) FILTER (WHERE vote_type = 'scam'),
    COUNT(*)
  INTO safe_votes, scam_votes, total_votes
  FROM public.votes WHERE votes.scan_id = calculate_risk_score.scan_id;
  
  -- Get flagged status
  SELECT search_results.is_flagged INTO is_flagged 
  FROM public.search_results WHERE id = calculate_risk_score.scan_id;
  
  -- Calculate base score
  IF total_votes = 0 THEN
    risk_score := CASE WHEN is_flagged THEN 75 ELSE 25 END;
  ELSE
    risk_score := (scam_votes * 100) / total_votes;
  END IF;
  
  -- Adjust for flagged content
  IF is_flagged THEN
    risk_score := GREATEST(risk_score, 60);
  END IF;
  
  RETURN LEAST(100, risk_score);
END;
$function$;