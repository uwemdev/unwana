import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useICPWallet } from "./useICPWallet";
import { useToast } from "./use-toast";

interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  users: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  users: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postComments, setPostComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isConnected } = useICPWallet();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          users (
            username,
            display_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string) => {
    if (!isConnected || !user) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to create posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          content: content.trim(),
        });

      if (error) throw error;

      toast({
        title: "Post Created",
        description: "Your post has been published",
      });

      await fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const likePost = async (postId: string) => {
    if (!isConnected || !user) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from("post_likes")
          .insert({
            post_id: postId,
            user_id: user.id,
          });

        if (error) throw error;
      }

      await fetchPosts();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const fetchPostComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("post_comments")
        .select(`
          *,
          users (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPostComments(data || []);
    } catch (error) {
      console.error("Error fetching post comments:", error);
    }
  };

  const createPostComment = async (postId: string, content: string) => {
    if (!isConnected || !user) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to comment",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
        });

      if (error) throw error;

      toast({
        title: "Comment Added",
        description: "Your comment has been posted",
      });

      await fetchPostComments(postId);
      await fetchPosts(); // Update comment count
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    postComments,
    loading,
    fetchPosts,
    createPost,
    likePost,
    fetchPostComments,
    createPostComment,
  };
};