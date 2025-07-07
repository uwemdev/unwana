-- Create enum types for better data integrity
CREATE TYPE public.input_type AS ENUM ('wallet', 'token', 'dapp');
CREATE TYPE public.scan_status AS ENUM ('safe', 'scam', 'suspicious', 'pending');
CREATE TYPE public.vote_type AS ENUM ('safe', 'scam', 'unsure');

-- Create users table for wallet identity tracking
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  wallet_type TEXT NOT NULL DEFAULT 'icp', -- icp, plug, etc.
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create search_results table
CREATE TABLE public.search_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  input_type input_type NOT NULL,
  input_value TEXT NOT NULL,
  result_summary TEXT,
  scan_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_by UUID REFERENCES public.users(id),
  google_snippets JSONB DEFAULT '[]'::jsonb,
  is_flagged BOOLEAN DEFAULT false,
  scan_status scan_status DEFAULT 'pending',
  flagged_keywords TEXT[],
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(input_type, input_value)
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID NOT NULL REFERENCES public.search_results(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scan_id UUID NOT NULL REFERENCES public.search_results(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  vote_type vote_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(scan_id, user_id) -- One vote per user per scan
);

-- Create wallet_sessions table for audit/logs
CREATE TABLE public.wallet_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  wallet_address TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid()::text = wallet_address OR true); -- Allow public viewing for community features

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid()::text = wallet_address);

CREATE POLICY "Anyone can create user profiles" ON public.users
  FOR INSERT WITH CHECK (true);

-- RLS Policies for search_results (public for transparency)
CREATE POLICY "Anyone can view search results" ON public.search_results
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create scans" ON public.search_results
  FOR INSERT WITH CHECK (submitted_by IS NOT NULL);

CREATE POLICY "Users can update their own scans" ON public.search_results
  FOR UPDATE USING (submitted_by = (SELECT id FROM public.users WHERE wallet_address = auth.uid()::text));

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE wallet_address = auth.uid()::text));

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (user_id = (SELECT id FROM public.users WHERE wallet_address = auth.uid()::text));

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (user_id = (SELECT id FROM public.users WHERE wallet_address = auth.uid()::text));

-- RLS Policies for votes
CREATE POLICY "Anyone can view votes" ON public.votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create votes" ON public.votes
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE wallet_address = auth.uid()::text));

CREATE POLICY "Users can update their own votes" ON public.votes
  FOR UPDATE USING (user_id = (SELECT id FROM public.users WHERE wallet_address = auth.uid()::text));

-- RLS Policies for wallet_sessions
CREATE POLICY "Users can view their own sessions" ON public.wallet_sessions
  FOR SELECT USING (user_id = (SELECT id FROM public.users WHERE wallet_address = auth.uid()::text));

CREATE POLICY "Users can create their own sessions" ON public.wallet_sessions
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.users WHERE wallet_address = auth.uid()::text));

-- Create indexes for better performance
CREATE INDEX idx_search_results_input ON public.search_results(input_type, input_value);
CREATE INDEX idx_search_results_status ON public.search_results(scan_status);
CREATE INDEX idx_search_results_flagged ON public.search_results(is_flagged);
CREATE INDEX idx_comments_scan_id ON public.comments(scan_id);
CREATE INDEX idx_votes_scan_id ON public.votes(scan_id);
CREATE INDEX idx_users_wallet ON public.users(wallet_address);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_search_results_updated_at
  BEFORE UPDATE ON public.search_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate risk score based on votes and flags
CREATE OR REPLACE FUNCTION public.calculate_risk_score(scan_id UUID)
RETURNS INTEGER AS $$
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
$$ LANGUAGE plpgsql;