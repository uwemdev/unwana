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
  MoreHorizontal
} from "lucide-react";
import { useScanHistory } from "@/hooks/useScanHistory";
import { useICPWallet } from "@/hooks/useICPWallet";
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
  const { user, isConnected } = useICPWallet();
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});

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
      if (filterBy === "all") return true;
      return scan.scan_status === filterBy;
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

  if (loading) {
    return (
      <div className="container mx-auto p-3 md:p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading community data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6 max-w-7xl">
      <div className="text-center space-y-2 md:space-y-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">Community Security Hub</h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2">
          Join our community-driven security network. Share scans, vote on threats, and help protect the ICP ecosystem.
        </p>
      </div>

      {/* Filters and Sort */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Filter className="h-4 w-4 md:h-5 md:w-5" />
            Filter & Sort
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium block">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="risk-high">High Risk First</SelectItem>
                  <SelectItem value="risk-low">Low Risk First</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium block">Filter by Status</label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="h-9 md:h-10 text-sm">
                  <SelectValue placeholder="Filter by..." />
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
      </div>

      {filteredAndSortedScans.length === 0 && (
        <Card className="text-center py-8 md:py-12">
          <CardContent>
            <Shield className="h-8 w-8 md:h-12 md:w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-base md:text-lg font-medium mb-2">No scans found</h3>
            <p className="text-sm md:text-base text-muted-foreground px-4">
              {filterBy === "all" 
                ? "No scans have been performed yet. Start by scanning an address on the home page."
                : `No ${filterBy} scans found. Try adjusting your filters.`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Community;