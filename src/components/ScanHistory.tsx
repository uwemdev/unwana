import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, AlertTriangle, MessageSquare, Send, Clock } from "lucide-react";
import { useScanHistory } from "@/hooks/useScanHistory";
import { useICPWallet } from "@/hooks/useICPWallet";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface ScanHistoryProps {
  currentScanId?: string;
}

export default function ScanHistory({ currentScanId }: ScanHistoryProps) {
  const { scanHistory, votes, comments, submitVote, submitComment, fetchVotes, fetchComments } = useScanHistory();
  const { isConnected } = useICPWallet();
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [selectedScan, setSelectedScan] = useState<string | null>(currentScanId || null);

  const getRiskColor = (status: string | null) => {
    switch (status) {
      case "safe": return "text-safe";
      case "suspicious": return "text-warning";
      case "scam": return "text-danger";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBadgeVariant = (status: string | null) => {
    switch (status) {
      case "safe": return "safe";
      case "suspicious": return "warning";
      case "scam": return "danger";
      default: return "secondary";
    }
  };

  const handleCommentSubmit = async (scanId: string) => {
    const comment = newComment[scanId];
    if (!comment?.trim()) return;
    
    await submitComment(scanId, comment);
    setNewComment(prev => ({ ...prev, [scanId]: '' }));
  };

  const handleScanSelect = async (scanId: string) => {
    setSelectedScan(scanId);
    await fetchVotes(scanId);
    await fetchComments(scanId);
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

  if (scanHistory.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Scan History</h3>
          <p className="text-muted-foreground">
            Start by scanning a wallet address, token contract, or DApp URL above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Community Scan History</h2>
      
      {scanHistory.map((scan) => {
        const voteCounts = getVoteCounts(scan.id);
        const scanComments = getScanComments(scan.id);
        const isExpanded = selectedScan === scan.id;
        
        return (
          <Card key={scan.id} className="border-l-4" 
                style={{ borderLeftColor: scan.scan_status === 'safe' ? 'hsl(var(--safe))' : 
                                         scan.scan_status === 'scam' ? 'hsl(var(--danger))' : 
                                         scan.scan_status === 'suspicious' ? 'hsl(var(--warning))' : 
                                         'hsl(var(--border))' }}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="uppercase text-xs">
                      {scan.input_type}
                    </Badge>
                    <Badge variant={getRiskBadgeVariant(scan.scan_status) as any}>
                      {scan.scan_status || 'Unknown'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg break-all">
                    {scan.input_value}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {scan.result_summary}
                  </p>
                </div>
                
                <div className="text-right space-y-2">
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
                
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => submitVote(scan.id, 'safe')}
                    disabled={!isConnected}
                    className="gap-2"
                  >
                    <ThumbsUp className="h-4 w-4 text-safe" />
                    Safe ({voteCounts.safe})
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => submitVote(scan.id, 'scam')}
                    disabled={!isConnected}
                    className="gap-2"
                  >
                    <ThumbsDown className="h-4 w-4 text-danger" />
                    Scam ({voteCounts.scam})
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => submitVote(scan.id, 'unsure')}
                    disabled={!isConnected}
                    className="gap-2"
                  >
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Unsure ({voteCounts.unsure})
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => isExpanded ? setSelectedScan(null) : handleScanSelect(scan.id)}
                    className="gap-2 ml-auto"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Comments ({scanComments.length})
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              {isExpanded && (
                <div className="space-y-4 border-t pt-4">
                  {/* Comment Input */}
                  {isConnected && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Share your thoughts about this scan..."
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
                  )}

                  {/* Comments List */}
                  <div className="space-y-3">
                    {scanComments.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    ) : (
                      scanComments.map((comment) => (
                        <div key={comment.id} className="bg-muted/50 rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs font-mono">
                                {comment.users?.display_name || 
                                 `${comment.users?.wallet_address.slice(0, 6)}...${comment.users?.wallet_address.slice(-4)}`}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{comment.comment_text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}