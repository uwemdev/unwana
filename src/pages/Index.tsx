import { useState } from "react";
import ScannerForm from "@/components/ScannerForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import ReputationScore from "@/components/ReputationScore";
import CommunityReports from "@/components/CommunityReports";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/crypto-security-hero.jpg";

interface ScanResult {
  address: string;
  type: string;
  riskLevel: "safe" | "warning" | "danger";
  score: number;
  issues: string[];
  recommendations: string[];
}

interface ReputationData {
  address: string;
  totalReports: number;
  positiveVotes: number;
  negativeVotes: number;
  communityScore: number;
  lastUpdated: string;
}

const Index = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [reputation, setReputation] = useState<ReputationData | null>(null);
  const [currentAddress, setCurrentAddress] = useState("");

  const handleScan = async (address: string, type: string) => {
    setIsScanning(true);
    setCurrentAddress(address);
    setScanResult(null);
    setReputation(null);

    // Simulate API call with different results based on address
    setTimeout(() => {
      const mockResult = generateMockResult(address, type);
      const mockReputation = generateMockReputation(address);
      
      setScanResult(mockResult);
      setReputation(mockReputation);
      setIsScanning(false);
    }, 2000);
  };

  const generateMockResult = (address: string, type: string): ScanResult => {
    // Generate different results based on address characteristics
    const isHighRisk = address.toLowerCase().includes('scam') || address.toLowerCase().includes('fake');
    const isSuspicious = address.toLowerCase().includes('test') || address.length < 10;
    
    if (isHighRisk) {
      return {
        address,
        type,
        riskLevel: "danger",
        score: 15,
        issues: [
          "Known scam address reported by multiple users",
          "Honeypot contract detected - users cannot withdraw funds",
          "Malicious code patterns identified",
          "No verified source code available"
        ],
        recommendations: [
          "DO NOT interact with this address",
          "Report to relevant authorities",
          "Warn others in the community"
        ]
      };
    }
    
    if (isSuspicious) {
      return {
        address,
        type,
        riskLevel: "warning",
        score: 45,
        issues: [
          "Unusual trading patterns detected",
          "High slippage rates observed",
          "Limited transaction history"
        ],
        recommendations: [
          "Proceed with extreme caution",
          "Research thoroughly before interacting",
          "Consider using small test amounts first"
        ]
      };
    }
    
    return {
      address,
      type,
      riskLevel: "safe",
      score: 85,
      issues: [],
      recommendations: [
        "Address appears legitimate",
        "Continue monitoring for any changes",
        "Always verify transactions before confirming"
      ]
    };
  };

  const generateMockReputation = (address: string): ReputationData => {
    const isHighRisk = address.toLowerCase().includes('scam') || address.toLowerCase().includes('fake');
    const isSuspicious = address.toLowerCase().includes('test') || address.length < 10;
    
    if (isHighRisk) {
      return {
        address,
        totalReports: 47,
        positiveVotes: 2,
        negativeVotes: 45,
        communityScore: 15,
        lastUpdated: "2 hours ago"
      };
    }
    
    if (isSuspicious) {
      return {
        address,
        totalReports: 12,
        positiveVotes: 6,
        negativeVotes: 6,
        communityScore: 50,
        lastUpdated: "1 day ago"
      };
    }
    
    return {
      address,
      totalReports: 8,
      positiveVotes: 7,
      negativeVotes: 1,
      communityScore: 87,
      lastUpdated: "3 days ago"
    };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Crypto Guardian Eye
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Advanced blockchain security scanner powered by ICP. Detect scams, analyze wallet behavior, and protect your crypto assets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">Real-time Scanning</h3>
                <p className="text-sm text-muted-foreground">
                  Instant analysis of wallet addresses, token contracts, and DApps
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Powered by community reports and decentralized reputation scoring
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-lg mb-2">ICP Blockchain</h3>
                <p className="text-sm text-muted-foreground">
                  Secure, transparent, and immutable security data storage
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Scanner Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto space-y-8">
          <ScannerForm onScan={handleScan} isScanning={isScanning} />
          
          {isScanning && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium">Analyzing security patterns...</span>
              </div>
            </div>
          )}
          
          {scanResult && (
            <div className="space-y-8">
              <ResultsDisplay result={scanResult} />
              <ReputationScore reputation={reputation} />
              <CommunityReports address={currentAddress} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;