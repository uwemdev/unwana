import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, AlertTriangle, Shield, TrendingUp } from "lucide-react";

const Reports = () => {
  const reports = [
    {
      id: 1,
      title: "Weekly Security Summary",
      description: "Comprehensive overview of detected threats and community activity",
      date: "2025-01-06",
      type: "security",
      status: "available",
      size: "2.4 MB"
    },
    {
      id: 2,
      title: "DeFi Risk Assessment",
      description: "Analysis of DeFi protocol security and risk patterns",
      date: "2025-01-03",
      type: "defi",
      status: "available",
      size: "1.8 MB"
    },
    {
      id: 3,
      title: "Monthly Threat Intelligence",
      description: "Detailed breakdown of emerging crypto security threats",
      date: "2025-01-01",
      type: "threat",
      status: "generating",
      size: "3.2 MB"
    },
    {
      id: 4,
      title: "Community Contribution Report",
      description: "Statistics on community scans, votes, and contributions",
      date: "2024-12-28",
      type: "community",
      status: "available",
      size: "1.1 MB"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "security":
        return <Shield className="h-4 w-4" />;
      case "defi":
        return <TrendingUp className="h-4 w-4" />;
      case "threat":
        return <AlertTriangle className="h-4 w-4" />;
      case "community":
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "security":
        return "bg-green-100 text-green-800 border-green-200";
      case "defi":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "threat":
        return "bg-red-100 text-red-800 border-red-200";
      case "community":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "generating":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Security Reports</h1>
          <p className="text-muted-foreground">Download comprehensive security analysis reports</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">24</p>
            <p className="text-sm text-muted-foreground">Reports Generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Download className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">Total Downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold">89</p>
            <p className="text-sm text-muted-foreground">Threats Identified</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {getTypeIcon(report.type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(report.type)} variant="outline">
                        {report.type}
                      </Badge>
                      <Badge className={getStatusColor(report.status)} variant="outline">
                        {report.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.date).toLocaleDateString()} • {report.size}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.status === "available" ? (
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      Generating...
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle>Report Types Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium">Security Reports</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Weekly security summaries</li>
                <li>• Threat analysis and trends</li>
                <li>• Risk assessment reports</li>
                <li>• Incident response summaries</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">Community Reports</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• User activity statistics</li>
                <li>• Community voting patterns</li>
                <li>• Contribution leaderboards</li>
                <li>• Network growth metrics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;