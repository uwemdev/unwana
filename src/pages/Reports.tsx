import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, AlertTriangle, CheckCircle } from "lucide-react";

export default function Reports() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Security Reports</h1>
        </div>
        <p className="text-muted-foreground">
          Comprehensive security reports and threat intelligence from the blockchain ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Active scams and high-risk addresses detected by the community.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Weekly Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Comprehensive weekly security analysis and trend reports.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Verified Safe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Community-verified safe addresses and contracts.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Detailed security reports, threat intelligence feeds, and automated vulnerability assessments will be available soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}