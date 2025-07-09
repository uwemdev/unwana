import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Calendar,
  Filter,
  Shield,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Send,
  Heart,
  MoreHorizontal,
  Search,
  Plus,
  PenTool
} from "lucide-react";
import { useScanHistory } from "@/hooks/useScanHistory";
import { usePosts } from "@/hooks/usePosts";
import { useICPWallet } from "@/hooks/useICPWallet";
import { PostContent } from "@/components/PostContent";
import { formatDistanceToNow } from "date-fns";

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

const Community = () => {
  const { scanHistory, votes, comments, loading, fetchScanHistory, fetchVotes, fetchComments, submitVote, submitComment } = useScanHistory();
  const { posts, postComments, loading: postsLoading, createPost, likePost, fetchPostComments, createPostComment } = usePosts();
  const { user, isConnected } = useICPWallet();
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [expandedPostComments, setExpandedPostComments] = useState<Set<string>>(new Set());
  const [newPostComment, setNewPostComment] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchScanHistory();
    fetchVotes();
    fetchComments();
  }, []);

  const handleVote = async (scanId: string, voteType: 'safe' | 'scam' | 'unsure') => {
    await submitVote(scanId, voteType);
    fetchVotes(scanId);
  };

  const handleComment = async (scanId: string) => {
    const commentText = newComment[scanId];
    if (!commentText?.trim()) return;
    
    await submitComment(scanId, commentText);
    setNewComment(prev => ({ ...prev, [scanId]: "" }));
    fetchComments(scanId);
  };

  const toggleComments = (scanId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(scanId)) {
      newExpanded.delete(scanId);
    } else {
      newExpanded.add(scanId);
      fetchComments(scanId);
    }
    setExpandedComments(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return <CheckCircle className="h-4 w-4 text-safe" />;
      case "scam": return <XCircle className="h-4 w-4 text-danger" />;
      case "suspicious": return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "bg-safe/10 text-safe border-safe/20";
      case "scam": return "bg-danger/10 text-danger border-danger/20";
      case "suspicious": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getVoteCounts = (scanId: string) => {
    const scanVotes = votes.filter(v => v.scan_id === scanId);
    return {
      safe: scanVotes.filter(v => v.vote_type === 'safe').length,
      scam: scanVotes.filter(v => v.vote_type === 'scam').length,
      unsure: scanVotes.filter(v => v.vote_type === 'unsure').length,
    };
  };

  const getScanComments = (scanId: string) => {
    return comments.filter(c => c.scan_id === scanId);
  };

  const getUserVote = (scanId: string) => {
    return votes.find(v => v.scan_id === scanId && v.user_id === user?.id);
  };

  const filteredAndSortedScans = scanHistory
    .filter(scan => {
      if (filterBy !== "all" && scan.scan_status !== filterBy) return false;
      if (searchQuery && !scan.input_value.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.scan_time).getTime() - new Date(a.scan_time).getTime();
        case "oldest":
          return new Date(a.scan_time).getTime() - new Date(b.scan_time).getTime();
        case "risk-high":
          return (b.risk_score || 0) - (a.risk_score || 0);
        case "risk-low":
          return (a.risk_score || 0) - (b.risk_score || 0);
        default:
          return 0;
      }
    });

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    await createPost(newPostContent);
    setNewPostContent("");
    setShowCreatePost(false);
  };

  const handlePostComment = async (postId: string) => {
    const comment = newPostComment[postId];
    if (!comment?.trim()) return;
    
    await createPostComment(postId, comment);
    setNewPostComment(prev => ({ ...prev, [postId]: "" }));
  };

  const togglePostComments = (postId: string) => {
    const newExpanded = new Set(expandedPostComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      fetchPostComments(postId);
    }
    setExpandedPostComments(newExpanded);
  };

  if (loading || postsLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading community data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold">Community Hub</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join our community-driven security network. Share insights, vote on threats, and help protect the ecosystem.
        </p>
      </div>

      <Tabs defaultValue="scans" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scans">Security Scans</TabsTrigger>
          <TabsTrigger value="posts">Community Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="scans" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search scans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="risk-high">High Risk First</SelectItem>
                      <SelectItem value="risk-low">Low Risk First</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Scans</SelectItem>
                      <SelectItem value="safe">Safe Only</SelectItem>
                      <SelectItem value="scam">Scam Only</SelectItem>
                      <SelectItem value="suspicious">Suspicious Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scan Results */}
          <div className="space-y-4">
        {filteredAndSortedScans.map((scan) => {
          const voteCounts = getVoteCounts(scan.id);
          const scanComments = getScanComments(scan.id);
          const userVote = getUserVote(scan.id);
          const isCommentsExpanded = expandedComments.has(scan.id);

          return (
            <Card key={scan.id} className="overflow-hidden">
              <CardHeader className="pb-3 md:pb-4 p-3 md:p-6">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {getStatusIcon(scan.scan_status || "")}
                      <Badge className={`${getStatusColor(scan.scan_status || "")} text-xs`}>
                        {scan.scan_status?.toUpperCase() || "PENDING"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {scan.input_type?.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-xs md:text-sm text-foreground break-all">
                      {scan.input_value}
                    </h3>
                  </div>
                  <div className="text-right text-xs text-muted-foreground w-full sm:w-auto sm:ml-4">
                    <div className="flex items-center gap-1 justify-end sm:justify-start">
                      <Calendar className="h-3 w-3" />
                      <span className="truncate">{formatDistanceToNow(new Date(scan.scan_time), { addSuffix: true })}</span>
                    </div>
                    {scan.risk_score && (
                      <div className="mt-1">
                        Score: {scan.risk_score}/100
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 p-3 md:p-6">
                {/* Community Voting */}
                <div className="space-y-3 mb-4">
                  <div className="text-xs md:text-sm font-medium">Community Vote:</div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      size="sm"
                      variant={userVote?.vote_type === 'safe' ? 'default' : 'outline'}
                      onClick={() => handleVote(scan.id, 'safe')}
                      disabled={!isConnected}
                      className="h-8 md:h-9 px-2 md:px-3 text-xs flex-col md:flex-row gap-1"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span className="hidden sm:inline">Safe</span>
                      <span>({voteCounts.safe})</span>
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={userVote?.vote_type === 'scam' ? 'default' : 'outline'}
                      onClick={() => handleVote(scan.id, 'scam')}
                      disabled={!isConnected}
                      className="h-8 md:h-9 px-2 md:px-3 text-xs flex-col md:flex-row gap-1"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      <span className="hidden sm:inline">Scam</span>
                      <span>({voteCounts.scam})</span>
                    </Button>
                    
                    <Button
                      size="sm"
                      variant={userVote?.vote_type === 'unsure' ? 'default' : 'outline'}
                      onClick={() => handleVote(scan.id, 'unsure')}
                      disabled={!isConnected}
                      className="h-8 md:h-9 px-2 md:px-3 text-xs flex-col md:flex-row gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      <span className="hidden sm:inline">Unsure</span>
                      <span>({voteCounts.unsure})</span>
                    </Button>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="border-t pt-3 md:pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComments(scan.id)}
                    className="mb-3 h-8 text-xs w-full sm:w-auto justify-start"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Comments ({scanComments.length})
                  </Button>

                  {isCommentsExpanded && (
                    <div className="space-y-3">
                      <div className="space-y-3">
                        {scanComments.map((comment) => (
                          <div key={comment.id} className="flex gap-2 md:gap-3 p-2 md:p-3 bg-muted/50 rounded-lg">
                            <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                              <AvatarFallback className="text-xs">
                                {comment.users.display_name?.charAt(0) || comment.users.wallet_address.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1">
                                <span className="text-xs md:text-sm font-medium truncate">
                                  {comment.users.display_name || `${comment.users.wallet_address.slice(0, 8)}...`}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-xs md:text-sm text-foreground break-words">{comment.comment_text}</p>
                            </div>
                          </div>
                        ))}

                        {scanComments.length === 0 && (
                          <div className="text-center py-4 text-xs md:text-sm text-muted-foreground">
                            No comments yet. Be the first to share your thoughts!
                          </div>
                        )}
                      </div>

                      {isConnected && (
                        <div className="flex flex-col sm:flex-row gap-2 mt-3">
                          <Textarea
                            placeholder="Add a comment..."
                            value={newComment[scan.id] || ""}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [scan.id]: e.target.value }))}
                            className="flex-1 min-h-[60px] md:min-h-[80px] text-xs md:text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleComment(scan.id)}
                            disabled={!newComment[scan.id]?.trim()}
                            className="self-end w-full sm:w-auto h-8 md:h-9"
                          >
                            <Send className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-0" />
                            <span className="sm:hidden">Post</span>
                          </Button>
                        </div>
                      )}

                      {!isConnected && (
                        <div className="text-center py-3 text-xs md:text-sm text-muted-foreground">
                          Connect your wallet to join the discussion
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
          })}
          
          {filteredAndSortedScans.length === 0 && (
            <Card className="text-center py-8">
              <CardContent>
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No scans found</h3>
                <p className="text-muted-foreground">
                  {filterBy === "all" 
                    ? "No scans match your search criteria."
                    : `No ${filterBy} scans found. Try adjusting your filters.`
                  }
                </p>
              </CardContent>
            </Card>
          )}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          {/* Create Post */}
          {isConnected && (
            <Card>
              <CardContent className="p-4">
                {!showCreatePost ? (
                  <Button 
                    onClick={() => setShowCreatePost(true)}
                    className="w-full"
                    variant="outline"
                  >
                    <PenTool className="h-4 w-4 mr-2" />
                    Share your thoughts with the community...
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="What's on your mind? Use @ for mentions and # for hashtags..."
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                        Post
                      </Button>
                      <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => {
              const isCommentsExpanded = expandedPostComments.has(post.id);
              const postCommentsForPost = postComments.filter(c => c.post_id === post.id);
              
              return (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Post Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {post.users.display_name?.charAt(0) || post.users.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">
                              {post.users.display_name || post.users.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="text-sm">
                        <PostContent content={post.content} />
                      </div>

                      {/* Post Actions */}
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likePost(post.id)}
                          disabled={!isConnected}
                          className="gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          {post.likes_count}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePostComments(post.id)}
                          className="gap-2"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {post.comments_count}
                        </Button>
                      </div>

                      {/* Comments Section */}
                      {isCommentsExpanded && (
                        <div className="space-y-3 border-t pt-4">
                          {postCommentsForPost.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {comment.users.display_name?.charAt(0) || comment.users.username.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="bg-muted rounded-lg p-3">
                                  <p className="text-xs font-medium mb-1">
                                    {comment.users.display_name || comment.users.username}
                                  </p>
                                  <PostContent content={comment.content} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                          ))}

                          {isConnected && (
                            <div className="flex gap-2">
                              <Textarea
                                placeholder="Write a comment..."
                                value={newPostComment[post.id] || ""}
                                onChange={(e) => setNewPostComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                className="min-h-[60px] text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => handlePostComment(post.id)}
                                disabled={!newPostComment[post.id]?.trim()}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {posts.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to share something with the community!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;