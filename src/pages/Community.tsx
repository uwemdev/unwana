import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, ThumbsUp, ThumbsDown, AlertTriangle, MessageSquare, Send, Calendar, User, TrendingUp, Users } from "lucide-react";
import { useScanHistory } from "@/hooks/useScanHistory";
import { useICPWallet } from "@/hooks/useICPWallet";
import { formatDistanceToNow } from "date-fns";

export default function Community() {
  const { scanHistory, votes, comments, submitVote, submitComment, fetchVotes, fetchComments } = useScanHistory();
  const { isConnected } = useICPWallet();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterType, setFilterType] = useState("all");
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [selectedScan, setSelectedScan] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all votes and comments for the community view
    fetchVotes();
    fetchComments();
  }, []);

  const filteredAndSortedScans = scanHistory
    .filter(scan => {
      const matchesSearch = scan.input_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (scan.result_summary?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === "all" || scan.input_type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "risk":
          return (b.risk_score || 0) - (a.risk_score || 0);
        case "votes":
          const aVotes = votes.filter(v => v.scan_id === a.id).length;
          const bVotes = votes.filter(v => v.scan_id === b.id).length;
          return bVotes - aVotes;
        default: // date
          return new Date(b.scan_time).getTime() - new Date(a.scan_time).getTime();
      }
    });

  const getRiskBadgeVariant = (status: string | null) => {
    switch (status) {
      case "safe": return "safe";
      case "suspicious": return "warning";
      case "scam": return "danger";
      default: return "secondary";
    }
  };

  const getVoteCounts = (scanId: string) => {
    const scanVotes = votes.filter(v => v.scan_id === scanId);
    return {
      safe: scanVotes.filter(v => v.vote_type === 'safe').length,
      scam: scanVotes.filter(v => v.vote_type === 'scam').length,
      unsure: scanVotes.filter(v => v.vote_type === 'unsure').length,
      total: scanVotes.length,
    };
  };

  const getScanComments = (scanId: string) => {
    return comments.filter(c => c.scan_id === scanId);
  };

  const handleCommentSubmit = async (scanId: string) => {
    const comment = newComment[scanId];
    if (!comment?.trim()) return;
    
    await submitComment(scanId, comment);
    setNewComment(prev => ({ ...prev, [scanId]: '' }));
  };

  const handleScanSelect = async (scanId: string) => {
    setSelectedScan(selectedScan === scanId ? null : scanId);
    if (selectedScan !== scanId) {
      await fetchVotes(scanId);
      await fetchComments(scanId);
    }
  };

  const handleVoteClick = async (scanId: string, voteType: 'safe' | 'scam' | 'unsure') => {
    await submitVote(scanId, voteType);
    // Refresh votes for this scan
    await fetchVotes(scanId);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Community Security Feed</h1>
        </div>
        <p className="text-muted-foreground">
          Community-driven security insights and discussions about blockchain addresses and contracts.
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search addresses, contracts, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Latest
                    </div>
                  </SelectItem>
                  <SelectItem value="risk">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Score
                    </div>
                  </SelectItem>
                  <SelectItem value="votes">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Most Voted
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="wallet">Wallets</SelectItem>
                  <SelectItem value="token">Tokens</SelectItem>
                  <SelectItem value="dapp">DApps</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Results */}
      <div className="space-y-4">
        {filteredAndSortedScans.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Community Scans Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filterType !== "all" 
                  ? "Try adjusting your search or filters."
                  : "Be the first to scan and share security insights with the community!"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedScans.map((scan) => {
            const voteCounts = getVoteCounts(scan.id);
            const scanComments = getScanComments(scan.id);
            const isExpanded = selectedScan === scan.id;
            
            return (
              <Card key={scan.id} className="border-l-4 hover:shadow-md transition-shadow" 
                    style={{ borderLeftColor: scan.scan_status === 'safe' ? 'hsl(var(--safe))' : 
                                             scan.scan_status === 'scam' ? 'hsl(var(--danger))' : 
                                             scan.scan_status === 'suspicious' ? 'hsl(var(--warning))' : 
                                             'hsl(var(--border))' }}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="uppercase text-xs">
                          {scan.input_type}
                        </Badge>
                        <Badge variant={getRiskBadgeVariant(scan.scan_status) as any}>
                          {scan.scan_status || 'Unknown'}
                        </Badge>
                        {voteCounts.total > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {voteCounts.total} votes
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg break-all font-mono">
                        {scan.input_value}
                      </CardTitle>
                      {scan.result_summary && (
                        <p className="text-sm text-muted-foreground">
                          {scan.result_summary}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right space-y-2 flex-shrink-0">
                      {scan.risk_score !== null && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Risk Score</div>
                          <div className="w-20">
                            <Progress value={scan.risk_score} className="h-2" />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {scan.risk_score}/100
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(scan.scan_time), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Community Voting */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Community Feedback</h4>
                    
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVoteClick(scan.id, 'safe')}
                        disabled={!isConnected}
                        className="gap-2 flex-1 sm:flex-none"
                      >
                        <ThumbsUp className="h-4 w-4 text-safe" />
                        <span className="hidden sm:inline">Safe</span>
                        <span>({voteCounts.safe})</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVoteClick(scan.id, 'scam')}
                        disabled={!isConnected}
                        className="gap-2 flex-1 sm:flex-none"
                      >
                        <ThumbsDown className="h-4 w-4 text-danger" />
                        <span className="hidden sm:inline">Scam</span>
                        <span>({voteCounts.scam})</span>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVoteClick(scan.id, 'unsure')}
                        disabled={!isConnected}
                        className="gap-2 flex-1 sm:flex-none"
                      >
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="hidden sm:inline">Unsure</span>
                        <span>({voteCounts.unsure})</span>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleScanSelect(scan.id)}
                        className="gap-2 col-span-2 sm:col-span-1 sm:ml-auto"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Comments ({scanComments.length})</span>
                      </Button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {isExpanded && (
                    <div className="space-y-4 border-t pt-4">
                      {/* Comment Input */}
                      {isConnected ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Share your thoughts, experiences, or additional security insights..."
                            value={newComment[scan.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ 
                              ...prev, 
                              [scan.id]: e.target.value 
                            }))}
                            className="min-h-[80px]"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleCommentSubmit(scan.id)}
                            disabled={!newComment[scan.id]?.trim()}
                            className="gap-2"
                          >
                            <Send className="h-4 w-4" />
                            Post Comment
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Connect your wallet to join the conversation
                          </p>
                        </div>
                      )}

                      {/* Comments List */}
                      <div className="space-y-3">
                        {scanComments.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-6">
                            No comments yet. Be the first to share your insights!
                          </p>
                        ) : (
                          scanComments.map((comment) => (
                            <div key={comment.id} className="bg-muted/30 rounded-lg p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {comment.users?.display_name || 
                                     `${comment.users?.wallet_address.slice(0, 6)}...${comment.users?.wallet_address.slice(-4)}`}
                                  </Badge>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">{comment.comment_text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}