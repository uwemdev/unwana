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
      case "safe": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "scam": return <XCircle className="h-4 w-4 text-red-500" />;
      case "suspicious": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "bg-green-100 text-green-800 border-green-200";
      case "scam": return "bg-red-100 text-red-800 border-red-200";
      case "suspicious": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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
        case "risk":
          return (b.risk_score || 0) - (a.risk_score || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading community data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community Scan History</h1>
          <p className="text-muted-foreground">Browse and discuss security scans from the community</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="risk">Highest Risk</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scans</SelectItem>
              <SelectItem value="safe">Safe</SelectItem>
              <SelectItem value="suspicious">Suspicious</SelectItem>
              <SelectItem value="scam">Scam</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedScans.map((scan) => {
          const voteCounts = getVoteCounts(scan.id);
          const scanComments = getScanComments(scan.id);
          const isCommentsExpanded = expandedComments.has(scan.id);
          
          return (
            <Card key={scan.id} className="w-full">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(scan.scan_status || "pending")}
                      <Badge className={getStatusColor(scan.scan_status || "pending")}>
                        {scan.scan_status?.toUpperCase() || "PENDING"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {scan.input_type}
                      </Badge>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md mb-3">
                      <code className="text-sm break-all">{scan.input_value}</code>
                    </div>
                    
                    {scan.result_summary && (
                      <p className="text-sm text-muted-foreground mb-2">{scan.result_summary}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(scan.scan_time), { addSuffix: true })}
                      </span>
                      {scan.risk_score && (
                        <span>Risk Score: {scan.risk_score}/100</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Voting Section */}
                <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium mr-2">Community Vote:</span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote(scan.id, 'safe')}
                    disabled={!isConnected}
                    className="flex items-center gap-1 h-8 px-3"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    <span className="text-xs">Safe ({voteCounts.safe})</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote(scan.id, 'scam')}
                    disabled={!isConnected}
                    className="flex items-center gap-1 h-8 px-3"
                  >
                    <ThumbsDown className="h-3 w-3" />
                    <span className="text-xs">Scam ({voteCounts.scam})</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVote(scan.id, 'unsure')}
                    disabled={!isConnected}
                    className="flex items-center gap-1 h-8 px-3"
                  >
                    <Shield className="h-3 w-3" />
                    <span className="text-xs">Unsure ({voteCounts.unsure})</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleComments(scan.id)}
                    className="flex items-center gap-1 h-8 px-3 ml-2"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span className="text-xs">Comments ({scanComments.length})</span>
                  </Button>
                </div>
                
                {/* Comments Section */}
                {isCommentsExpanded && (
                  <div className="space-y-4 border-t pt-4">
                    {/* Add Comment */}
                    {isConnected && (
                      <div className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {user?.display_name?.[0] || user?.wallet_address.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            placeholder="Add a comment..."
                            value={newComment[scan.id] || ""}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [scan.id]: e.target.value }))}
                            className="min-h-[60px] text-sm"
                          />
                          <Button
                            onClick={() => handleComment(scan.id)}
                            disabled={!newComment[scan.id]?.trim()}
                            size="sm"
                            className="self-end"
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Comment List */}
                    <div className="space-y-3">
                      {scanComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {comment.users.display_name?.[0] || comment.users.wallet_address.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {comment.users.display_name || `${comment.users.wallet_address.slice(0, 6)}...${comment.users.wallet_address.slice(-4)}`}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm">{comment.comment_text}</p>
                          </div>
                        </div>
                      ))}
                      
                      {scanComments.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-4">
                          No comments yet. Be the first to share your thoughts!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredAndSortedScans.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No scans found</h3>
            <p className="text-muted-foreground">
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