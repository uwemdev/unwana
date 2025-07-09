import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, Shield, AlertTriangle, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Scans",
      value: "0",
      change: "0%",
      trend: "up",
      icon: BarChart3,
    },
    {
      title: "Scams Detected",
      value: "0",
      change: "0%",
      trend: "up",
      icon: AlertTriangle,
    },
    {
      title: "Safe Addresses",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Shield,
    },
    {
      title: "Active Users",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Users,
    },
  ]);

  const [recentTrends, setRecentTrends] = useState([
    { type: "DeFi Scams", count: 0, change: "0%" },
    { type: "Phishing Sites", count: 0, change: "0%" },
    { type: "Rug Pulls", count: 0, change: "0%" },
    { type: "Fake Tokens", count: 0, change: "0%" },
  ]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch total scans
      const { count: totalScans } = await supabase
        .from("search_results")
        .select("*", { count: "exact", head: true });

      // Fetch scams detected
      const { count: scamsDetected } = await supabase
        .from("search_results")
        .select("*", { count: "exact", head: true })
        .eq("scan_status", "scam");

      // Fetch safe addresses
      const { count: safeAddresses } = await supabase
        .from("search_results")
        .select("*", { count: "exact", head: true })
        .eq("scan_status", "safe");

      // Fetch active users
      const { count: activeUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      // Update stats
      setStats([
        {
          title: "Total Scans",
          value: totalScans?.toString() || "0",
          change: "0%",
          trend: "up" as const,
          icon: BarChart3,
        },
        {
          title: "Scams Detected",
          value: scamsDetected?.toString() || "0",
          change: "0%",
          trend: "up" as const,
          icon: AlertTriangle,
        },
        {
          title: "Safe Addresses",
          value: safeAddresses?.toString() || "0",
          change: "0%",
          trend: "up" as const,
          icon: Shield,
        },
        {
          title: "Active Users",
          value: activeUsers?.toString() || "0",
          change: "0%",
          trend: "up" as const,
          icon: Users,
        },
      ]);

      // Fetch scan status breakdown for trends
      const { data: scansByType } = await supabase
        .from("search_results")
        .select("input_type, scan_status");

      if (scansByType) {
        const tokenScams = scansByType.filter(s => s.input_type === 'token' && s.scan_status === 'scam').length;
        const dappScams = scansByType.filter(s => s.input_type === 'dapp' && s.scan_status === 'scam').length;
        const walletScams = scansByType.filter(s => s.input_type === 'wallet' && s.scan_status === 'scam').length;
        const suspiciousWallets = scansByType.filter(s => s.input_type === 'wallet' && s.scan_status === 'suspicious').length;

        setRecentTrends([
          { type: "Token Scams", count: tokenScams, change: "0%" },
          { type: "DApp Threats", count: dappScams, change: "0%" },
          { type: "Wallet Scams", count: walletScams, change: "0%" },
          { type: "Suspicious Activity", count: suspiciousWallets, change: "0%" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Analytics</h1>
        <p className="text-muted-foreground">Real-time community security statistics and trends</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTrends.map((trend) => (
              <div key={trend.type} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{trend.type}</p>
                  <p className="text-sm text-muted-foreground">Detected this week</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{trend.count}</p>
                  <Badge variant={trend.count > 0 ? "destructive" : "secondary"}>
                    {trend.count > 0 ? `${trend.count} detected` : "None detected"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Features */}
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
              <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Interactive Charts</h3>
              <p className="text-sm text-muted-foreground">Real-time security trend visualizations</p>
            </div>
            <div className="p-4 border-2 border-dashed border-muted rounded-lg text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Risk Heatmaps</h3>
              <p className="text-sm text-muted-foreground">Geographic security risk distribution</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;