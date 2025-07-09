import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, Shield, AlertTriangle, Users } from "lucide-react";

const Analytics = () => {
  // Mock analytics data
  const stats = [
    {
      title: "Total Scans",
      value: "12,458",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
    },
    {
      title: "Scams Detected",
      value: "3,241",
      change: "+8%",
      trend: "up",
      icon: AlertTriangle,
    },
    {
      title: "Safe Addresses",
      value: "8,917",
      change: "+15%",
      trend: "up",
      icon: Shield,
    },
    {
      title: "Active Users",
      value: "2,145",
      change: "+23%",
      trend: "up",
      icon: Users,
    },
  ];

  const recentTrends = [
    { type: "DeFi Scams", count: 45, change: "+12%" },
    { type: "Phishing Sites", count: 32, change: "-5%" },
    { type: "Rug Pulls", count: 28, change: "+8%" },
    { type: "Fake Tokens", count: 67, change: "+18%" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Analytics</h1>
        <p className="text-muted-foreground">Community security statistics and trends</p>
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
                  <Badge variant={trend.change.startsWith("+") ? "destructive" : "secondary"}>
                    {trend.change}
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