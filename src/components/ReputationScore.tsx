import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Flag, TrendingUp, TrendingDown } from "lucide-react";

interface ReputationData {
  address: string;
  totalReports: number;
  positiveVotes: number;
  negativeVotes: number;
  communityScore: number;
  lastUpdated: string;
}

interface ReputationScoreProps {
  reputation: ReputationData | null;
}

export default function ReputationScore({ reputation }: ReputationScoreProps) {
  if (!reputation) return null;

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-safe";
    if (score >= 40) return "text-warning";
    return "text-danger";
  };

  const getTrustLevel = (score: number) => {
    if (score >= 70) return { level: "Trusted", color: "bg-safe text-safe-foreground" };
    if (score >= 40) return { level: "Neutral", color: "bg-warning text-warning-foreground" };
    return { level: "Flagged", color: "bg-danger text-danger-foreground" };
  };

  const trustInfo = getTrustLevel(reputation.communityScore);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Community Reputation</span>
          <Badge className={trustInfo.color}>
            {trustInfo.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Reports</span>
            </div>
            <p className="text-2xl font-bold">{reputation.totalReports}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Community Score</span>
            </div>
            <p className={`text-2xl font-bold ${getScoreColor(reputation.communityScore)}`}>
              {reputation.communityScore}/100
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Community Trust Level</span>
            <span className={`text-sm font-bold ${getScoreColor(reputation.communityScore)}`}>
              {reputation.communityScore}%
            </span>
          </div>
          <Progress value={reputation.communityScore} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-safe/10 rounded-lg">
            <TrendingUp className="h-5 w-5 text-safe" />
            <div>
              <p className="text-sm text-muted-foreground">Positive Votes</p>
              <p className="font-semibold text-safe">{reputation.positiveVotes}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-danger/10 rounded-lg">
            <TrendingDown className="h-5 w-5 text-danger" />
            <div>
              <p className="text-sm text-muted-foreground">Negative Votes</p>
              <p className="font-semibold text-danger">{reputation.negativeVotes}</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Last updated: {reputation.lastUpdated}
        </div>
      </CardContent>
    </Card>
  );
}