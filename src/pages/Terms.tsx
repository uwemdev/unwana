import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, AlertTriangle, Shield } from "lucide-react";

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-xs px-3 py-1">
          <FileText className="h-3 w-3 mr-1" />
          Legal Document
        </Badge>
        <h1 className="text-4xl font-bold">Terms of Use</h1>
        <p className="text-muted-foreground">
          Last updated: January 9, 2025
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Important Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            By using ICP Security Scanner, you agree to these terms of use. Please read them carefully 
            before using our platform. These terms constitute a legally binding agreement between you 
            and the ICP Security Scanner project.
          </p>
        </CardContent>
      </Card>

      <ScrollArea className="h-[600px]">
        <div className="space-y-6">
          {/* Section 1 */}
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                By accessing and using ICP Security Scanner ("the Service"), you accept and agree to 
                be bound by the terms and provision of this agreement.
              </p>
              <p className="text-sm text-muted-foreground">
                If you do not agree to these Terms of Use, please do not use the Service.
              </p>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card>
            <CardHeader>
              <CardTitle>2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                ICP Security Scanner is a blockchain security analysis platform that provides:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Security scanning of wallet addresses, token contracts, and DApps</li>
                <li>Community-driven threat intelligence and reporting</li>
                <li>Risk assessment and security recommendations</li>
                <li>Historical security data and analytics</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card>
            <CardHeader>
              <CardTitle>3. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">You agree to:</p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Use the Service only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to any part of the Service</li>
                <li>Not use the Service to transmit malicious code or conduct harmful activities</li>
                <li>Respect other users and contribute positively to the community</li>
                <li>Maintain the security of your wallet connections</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card>
            <CardHeader>
              <CardTitle>4. Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">
                  ⚠️ Important Security Notice
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Our security analysis is provided for informational purposes only and should not 
                  be considered as definitive security advice.
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                The Service is provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Accuracy or completeness of security assessments</li>
                <li>Detection of all security threats or vulnerabilities</li>
                <li>Uninterrupted or error-free service operation</li>
                <li>Security of blockchain transactions or smart contracts</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card>
            <CardHeader>
              <CardTitle>5. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                To the maximum extent permitted by law, ICP Security Scanner and its contributors 
                shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages, including loss of profits, data, or other intangible losses resulting from:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Your use or inability to use the Service</li>
                <li>Financial losses from crypto transactions</li>
                <li>Security breaches or scams not detected by our platform</li>
                <li>Inaccurate or incomplete security assessments</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6 */}
          <Card>
            <CardHeader>
              <CardTitle>6. Privacy and Data Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                We collect and process data to provide our security services:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Wallet addresses submitted for scanning</li>
                <li>User voting and commenting activity</li>
                <li>Anonymous usage analytics</li>
                <li>Community contribution metrics</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Your privacy is important to us. We do not share personal information with third parties 
                except as necessary to provide the Service.
              </p>
            </CardContent>
          </Card>

          {/* Section 7 */}
          <Card>
            <CardHeader>
              <CardTitle>7. Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                When participating in community features (voting, commenting), you must:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Provide honest and accurate information</li>
                <li>Respect other community members</li>
                <li>Not manipulate voting or gaming systems</li>
                <li>Report genuine security concerns only</li>
                <li>Avoid spam, harassment, or abusive behavior</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 8 */}
          <Card>
            <CardHeader>
              <CardTitle>8. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                The Service and its original content, features, and functionality are owned by 
                ICP Security Scanner and are protected by international copyright, trademark, 
                and other intellectual property laws.
              </p>
            </CardContent>
          </Card>

          {/* Section 9 */}
          <Card>
            <CardHeader>
              <CardTitle>9. Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                We reserve the right to modify these terms at any time. We will notify users of 
                significant changes through the platform. Your continued use of the Service after 
                changes become effective constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          {/* Section 10 */}
          <Card>
            <CardHeader>
              <CardTitle>10. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If you have questions about these Terms of Use, please contact us through:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>GitHub Issues (when available)</li>
                <li>Community Discord (when available)</li>
                <li>Platform feedback system</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      <Separator />

      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">
            By using ICP Security Scanner, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms of Use.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Terms;