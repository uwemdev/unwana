import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, CheckCircle, XCircle } from "lucide-react";

interface ScanResult {
  address: string;
  type: string;
  riskLevel: "safe" | "warning" | "danger";
  score: number;
  issues: string[];
  recommendations: string[];
}

interface ResultsDisplayProps {
  result: ScanResult | null;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  if (!result) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case "safe": return "bg-safe text-safe-foreground";
      case "warning": return "bg-warning text-warning-foreground";
      case "danger": return "bg-danger text-danger-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "safe": return <CheckCircle className="h-5 w-5" />;
      case "warning": return <AlertTriangle className="h-5 w-5" />;
      case "danger": return <XCircle className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case "safe": return "Safe";
      case "warning": return "Suspicious";
      case "danger": return "High Risk";
      default: return "Unknown";
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto glass-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="sunlight-glow">Security Analysis Results</span>
          <Badge className={`${getRiskColor(result.riskLevel)} flex items-center gap-2`}>
            {getRiskIcon(result.riskLevel)}
            {getRiskText(result.riskLevel)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Security Score</span>
            <span className="text-sm font-bold">{result.score}/100</span>
          </div>
          <Progress value={result.score} className="h-3" />
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Analyzed Address:</h4>
          <div className="bg-muted p-3 rounded-md">
            <code className="text-sm break-all">{result.address}</code>
          </div>
        </div>

        {result.issues.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-danger">Security Issues Found:</h4>
            <ul className="space-y-2">
              {result.issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-danger mt-0.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-primary">Recommendations:</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}