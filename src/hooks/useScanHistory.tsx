import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useICPWallet } from "./useICPWallet";
import { useToast } from "./use-toast";

interface ScanResult {
  id: string;
  input_type: string;
  input_value: string;
  result_summary: string | null;
  scan_time: string;
  google_snippets: any;
  is_flagged: boolean | null;
  scan_status: 'safe' | 'suspicious' | 'scam' | 'pending' | null;
  flagged_keywords: string[] | null;
  risk_score: number | null;
  submitted_by: string | null;
}

interface Vote {
  id: string;
  scan_id: string;
  user_id: string;
  vote_type: 'safe' | 'scam' | 'unsure';
  created_at: string;
}

interface Comment {
  id: string;
  scan_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  users: {
    wallet_address: string;
    display_name?: string;
  };
}

export const useScanHistory = () => {
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isConnected } = useICPWallet();
  const { toast } = useToast();

  const fetchScanHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("search_results")
        .select("*")
        .order("scan_time", { ascending: false });

      if (error) throw error;
      setScanHistory((data as ScanResult[]) || []);
    } catch (error) {
      console.error("Error fetching scan history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch scan history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVotes = async (scanId?: string) => {
    try {
      let query = supabase.from("votes").select("*");
      if (scanId) {
        query = query.eq("scan_id", scanId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setVotes(data || []);
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  };

  const fetchComments = async (scanId?: string) => {
    try {
      let query = supabase
        .from("comments")
        .select(`
          *,
          users (
            wallet_address,
            display_name
          )
        `);
      
      if (scanId) {
        query = query.eq("scan_id", scanId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const submitVote = async (scanId: string, voteType: 'safe' | 'scam' | 'unsure') => {
    if (!isConnected || !user) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upsert vote (update if exists, insert if not)
      const { error } = await supabase
        .from("votes")
        .upsert({
          scan_id: scanId,
          user_id: user.id,
          vote_type: voteType,
        });

      if (error) throw error;

      toast({
        title: "Vote Submitted",
        description: `Your vote has been recorded as "${voteType}"`,
      });

      // Refresh votes
      await fetchVotes();
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive",
      });
    }
  };

  const submitComment = async (scanId: string, commentText: string) => {
    if (!isConnected || !user) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to comment",
        variant: "destructive",
      });
      return;
    }

    if (!commentText.trim()) {
      toast({
        title: "Invalid Comment",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("comments")
        .insert({
          scan_id: scanId,
          user_id: user.id,
          comment_text: commentText.trim(),
        });

      if (error) throw error;

      toast({
        title: "Comment Posted",
        description: "Your comment has been added",
      });

      // Refresh comments
      await fetchComments(scanId);
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const performScan = async (inputType: string, inputValue: string) => {
    if (!isConnected || !user) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to perform scans",
        variant: "destructive",
      });
      return null;
    }

    try {
      setLoading(true);

      const response = await supabase.functions.invoke('google-search', {
        body: {
          inputType,
          inputValue,
          userId: user.id,
        },
      });

      if (response.error) throw response.error;

      const { scanResult, isNewScan } = response.data;

      if (isNewScan) {
        toast({
          title: "Scan Complete",
          description: "New scan results have been generated",
        });
      } else {
        toast({
          title: "Existing Results",
          description: "Showing previous scan results for this input",
        });
      }

      // Refresh scan history
      await fetchScanHistory();

      return scanResult;
    } catch (error) {
      console.error("Error performing scan:", error);
      toast({
        title: "Scan Failed",
        description: "Failed to perform security scan",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScanHistory();
  }, []);

  return {
    scanHistory,
    votes,
    comments,
    loading,
    fetchScanHistory,
    fetchVotes,
    fetchComments,
    submitVote,
    submitComment,
    performScan,
  };
};