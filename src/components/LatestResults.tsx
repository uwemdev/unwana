import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ScanResult {
  id: string;
  input_value: string;
  input_type: string;
  scan_status: string;
  risk_score: number;
  created_at: string;
  result_summary: string;
  users?: {
    display_name?: string;
    username?: string;
  };
}

const LatestResults = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestResults();
  }, []);

  const fetchLatestResults = async () => {
    try {
      const { data, error } = await supabase
        .from("search_results")
        .select(`
          *,
          users (
            display_name,
            username
          )
        `)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error("Error fetching latest results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "scam":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      case "suspicious":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Scan Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Latest Scan Results</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/results" className="flex items-center gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No scan results yet. Start scanning to see results here.
          </p>
        ) : (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="border-l-2 border-border pl-4 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {result.input_type}
                  </Badge>
                  <Badge className={getRiskColor(result.scan_status)}>
                    {result.scan_status}
                  </Badge>
                  {result.risk_score && (
                    <Badge variant="secondary">
                      Risk: {result.risk_score}%
                    </Badge>
                  )}
                </div>
                
                <h4 className="font-mono text-sm break-all">
                  {result.input_value}
                </h4>
                
                {result.result_summary && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {result.result_summary}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    {format(new Date(result.created_at), "MMM d, h:mm a")}
                  </span>
                  {result.users?.display_name && (
                    <span>by {result.users.display_name}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestResults;