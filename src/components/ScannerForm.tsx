import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface ScannerFormProps {
  onScan: (address: string, type: string) => void;
  isScanning: boolean;
}

export default function ScannerForm({ onScan, isScanning }: ScannerFormProps) {
  const [address, setAddress] = useState("");
  const [selectedType, setSelectedType] = useState("wallet");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onScan(address.trim(), selectedType);
    }
  };

  const scanTypes = [
    { id: "wallet", label: "Wallet Address", example: "0x1234...abcd" },
    { id: "token", label: "Token Contract", example: "0xabcd...1234" },
    { id: "dapp", label: "DApp URL", example: "https://example.com" }
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto glass-card">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold sunlight-glow">Crypto Security Scanner</CardTitle>
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
              className="cursor-pointer px-4 py-2"
              onClick={() => setSelectedType(type.id)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder={scanTypes.find(t => t.id === selectedType)?.example || "Enter address..."}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="pr-12 h-12 text-lg"
              disabled={isScanning}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-2 h-8 w-8 p-0"
              disabled={!address.trim() || isScanning}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            type="submit"
            className="w-full h-12 text-lg glass-button sunlight-glow"
            disabled={!address.trim() || isScanning}
          >
            {isScanning ? "Scanning..." : "Scan for Security Risks"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}