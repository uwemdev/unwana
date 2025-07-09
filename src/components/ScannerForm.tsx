import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertTriangle, CheckCircle, Wallet } from "lucide-react";
import { validateInput, ValidationResult } from "@/components/InputValidator";
import { useICPWallet } from "@/hooks/useICPWallet";
import WalletConnection from "@/components/WalletConnection";

interface ScannerFormProps {
  onScan: (address: string, type: string) => void;
  isScanning: boolean;
}

export default function ScannerForm({ onScan, isScanning }: ScannerFormProps) {
  const [address, setAddress] = useState("");
  const [selectedType, setSelectedType] = useState("wallet");
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const { isConnected } = useICPWallet();

  const handleInputChange = (value: string) => {
    setAddress(value);
    if (value.trim()) {
      const result = validateInput(value);
      setValidation(result);
      if (result.isValid && result.type) {
        setSelectedType(result.type);
      }
    } else {
      setValidation(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAddress = address.trim();
    if (!trimmedAddress) return;
    
    const validationResult = validateInput(trimmedAddress);
    if (!validationResult.isValid) {
      setValidation(validationResult);
      return;
    }
    
    onScan(trimmedAddress, selectedType);
  };

  const scanTypes = [
    { id: "wallet", label: "Wallet Address", example: "0x1234...abcd" },
    { id: "token", label: "Token Contract", example: "0xabcd...1234" },
    { id: "dapp", label: "DApp URL", example: "https://example.com" }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!isConnected && (
        <WalletConnection />
      )}
      
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl md:text-2xl font-bold">Unwana Security Scanner</CardTitle>
          <CardDescription>
            Analyze wallet addresses, token contracts, and DApps for potential security risks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {scanTypes.map((type) => (
              <Badge
                key={type.id}
                variant={selectedType === type.id ? "default" : "secondary"}
                className={`cursor-pointer px-3 py-1 text-xs md:text-sm ${!isConnected ? 'opacity-50' : ''}`}
                onClick={() => isConnected && setSelectedType(type.id)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
          
          {!isConnected && (
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                Connect your wallet to start scanning for security risks
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={isConnected ? (scanTypes.find(t => t.id === selectedType)?.example || "Enter address...") : "Connect wallet to scan"}
                  value={address}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="pr-12 h-12 text-sm md:text-lg"
                  disabled={isScanning || !isConnected}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-2 h-8 w-8 p-0"
                  disabled={!address.trim() || isScanning || (validation && !validation.isValid) || !isConnected}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              {validation && (
                <Alert className={validation.isValid ? "border-safe" : "border-destructive"}>
                  <div className="flex items-center gap-2">
                    {validation.isValid ? (
                      <CheckCircle className="h-4 w-4 text-safe" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    <AlertDescription className="text-sm">
                      {validation.message}
                      {validation.isValid && validation.confidence < 0.8 && (
                        <span className="text-muted-foreground ml-2">
                          (Confidence: {Math.round(validation.confidence * 100)}%)
                        </span>
                      )}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 text-sm md:text-lg"
              disabled={!address.trim() || isScanning || (validation && !validation.isValid) || !isConnected}
            >
              {!isConnected ? "Connect Wallet to Scan" : isScanning ? "Scanning..." : "Scan for Security Risks"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}