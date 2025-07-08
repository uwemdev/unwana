import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, ArrowUpRight, ArrowDownLeft, Clock, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  hash: string;
  type: "sent" | "received";
  amount: string;
  token: string;
  from: string;
  to: string;
  timestamp: number;
  value: number;
  status: "confirmed" | "pending" | "failed";
}

interface TransactionHistoryProps {
  address: string;
  type: string;
}

export default function TransactionHistory({ address, type }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (type === "wallet" && address) {
      fetchTransactionHistory();
    }
  }, [address, type]);

  const fetchTransactionHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll generate mock data
      // In a real implementation, this would call a blockchain API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      const mockTransactions: Transaction[] = [
        {
          hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
          type: "received",
          amount: "0.5",
          token: "ETH",
          from: "0x742d35Cc7851b6064b80f8c0c7d9F3b8C9E2F8A1",
          to: address,
          timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
          value: 1250.75,
          status: "confirmed"
        },
        {
          hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
          type: "sent",
          amount: "1000",
          token: "USDC",
          from: address,
          to: "0x8A2B3C4D5E6F7890ABCDEF1234567890ABCDEF12",
          timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
          value: 1000.00,
          status: "confirmed"
        },
        {
          hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
          type: "received",
          amount: "0.1",
          token: "BTC",
          from: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          to: address,
          timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
          value: 4200.50,
          status: "confirmed"
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (err) {
      setError("Failed to fetch transaction history");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (type !== "wallet") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" onClick={fetchTransactionHistory} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions found for this address</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.hash} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    tx.type === "received" 
                      ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
                      : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                  }`}>
                    {tx.type === "received" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tx.type === "received" ? "Received" : "Sent"}</span>
                      <Badge variant="outline" className="text-xs">
                        {tx.token}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-mono">{formatHash(tx.hash)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDistanceToNow(tx.timestamp, { addSuffix: true })}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tx.type === "received" ? "From" : "To"}: {formatAddress(tx.type === "received" ? tx.from : tx.to)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="font-medium">
                    {tx.type === "received" ? "+" : "-"}{tx.amount} {tx.token}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {tx.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <Badge variant={tx.status === "confirmed" ? "default" : tx.status === "pending" ? "secondary" : "destructive"} className="text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            {transactions.length > 0 && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Block Explorer
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}