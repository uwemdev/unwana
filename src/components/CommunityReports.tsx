import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Flag, MessageSquare, AlertTriangle } from "lucide-react";

interface CommunityReportsProps {
  address: string;
}

export default function CommunityReports({ address }: CommunityReportsProps) {
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitReport = async () => {
    if (!reportText.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Report Submitted",
        description: "Your security report has been recorded and will be reviewed by the community.",
      });
      setReportText("");
      setIsSubmitting(false);
    }, 1000);
  };

  const recentReports = [
    {
      id: 1,
      type: "scam",
      description: "Honeypot contract detected - users cannot sell tokens",
      timestamp: "2 hours ago",
      votes: 15
    },
    {
      id: 2,
      type: "suspicious",
      description: "Unusual trading patterns and high slippage",
      timestamp: "1 day ago",
      votes: 8
    },
    {
      id: 3,
      type: "warning",
      description: "Contract has no verified source code",
      timestamp: "3 days ago",
      votes: 12
    }
  ];

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "scam": return "bg-danger text-danger-foreground";
      case "suspicious": return "bg-warning text-warning-foreground";
      case "warning": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Report Security Issue
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Describe the security issue:</label>
            <Textarea
              placeholder="Provide details about the security concern you've identified..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <Button
            onClick={handleSubmitReport}
            disabled={!reportText.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Security Report"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Community Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getReportTypeColor(report.type)}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{report.votes} votes</span>
                    <span>•</span>
                    <span>{report.timestamp}</span>
                  </div>
                </div>
                <p className="text-sm">{report.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}