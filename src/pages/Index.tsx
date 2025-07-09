
import { useState } from "react";
import ScannerForm from "@/components/ScannerForm";
import ResultsDisplay from "@/components/ResultsDisplay";
import WalletConnection from "@/components/WalletConnection";
import ScanHistory from "@/components/ScanHistory";
import { Card, CardContent } from "@/components/ui/card";
import { useScanHistory } from "@/hooks/useScanHistory";
import logoImage from "/lovable-uploads/372289b9-f24a-4330-b95c-b5cfb3c7c5af.png";

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
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const { performScan } = useScanHistory();

  const handleScan = async (address: string, type: string) => {
    setIsScanning(true);
    setScanResult(null);
    setCurrentScanId(null);

    try {
      const result = await performScan(type, address);
      if (result) {
        // Convert database result to component format
        const convertedResult: ScanResult = {
          address: result.input_value,
          type: result.input_type,
          riskLevel: result.scan_status === 'safe' ? 'safe' : 
                    result.scan_status === 'scam' ? 'danger' : 'warning',
          score: result.risk_score || 0,
          issues: result.flagged_keywords || [],
          recommendations: result.scan_status === 'scam' 
            ? ["DO NOT interact with this address", "Report to relevant authorities"]
            : result.scan_status === 'suspicious'
            ? ["Proceed with extreme caution", "Research thoroughly before interacting"]
            : ["Address appears legitimate", "Continue monitoring for any changes"]
        };
        
        setScanResult(convertedResult);
        setCurrentScanId(result.id);
      }
    } catch (error) {
      console.error("Scan failed:", error);
    } finally {
      setIsScanning(false);
    }
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
    <div className="space-y-8 md:space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 md:space-y-8">
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-center">
            <img 
              src={logoImage} 
              alt="Unwana Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Welcome to Unwana
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced blockchain security scanner. Detect scams, analyze wallet behavior, and protect your crypto assets with community-driven intelligence.
            </p>
          </div>
        </div>
          
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-4 md:p-6 text-center">
              <h3 className="font-semibold text-base md:text-lg mb-2 text-primary">Real-time Scanning</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Instant analysis of wallet addresses, token contracts, and DApps
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-colors">
            <CardContent className="p-4 md:p-6 text-center">
              <h3 className="font-semibold text-base md:text-lg mb-2 text-accent">Community Driven</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Powered by community reports and decentralized reputation scoring
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-logo-orange/20 hover:border-logo-orange/40 transition-colors">
            <CardContent className="p-4 md:p-6 text-center">
              <h3 className="font-semibold text-base md:text-lg mb-2 text-logo-orange">Blockchain Security</h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                Secure, transparent, and immutable security data storage
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Wallet Connection Section */}
      <section>
        <WalletConnection />
      </section>

      {/* Scanner Section */}
      <section className="space-y-6 md:space-y-8">
          <ScannerForm onScan={handleScan} isScanning={isScanning} />
          
          {isScanning && (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-yellow-400">Analyzing security patterns with ICP...</span>
              </div>
            </div>
          )}
          
          {scanResult && (
            <div className="space-y-8">
              <ResultsDisplay result={scanResult} />
            </div>
          )}

          {/* Scan History Section */}
          <ScanHistory currentScanId={currentScanId} />
        </div>
      </section>
    </div>
  );
};

export default Index;
