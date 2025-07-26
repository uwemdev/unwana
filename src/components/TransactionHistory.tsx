import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, Hash, Coins } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Transaction {
  hash: string;
  type: "send" | "receive" | "swap" | "contract";
  amount: string;
  token: string;
  timestamp: string;
  from: string;
  to: string;
  status: "confirmed" | "pending" | "failed";
  gasUsed?: string;
  gasPrice?: string;
}

interface TransactionHistoryProps {
  address: string;
}

export default function TransactionHistory({ address }: TransactionHistoryProps) {
  // Mock transaction data - in a real app, this would come from a blockchain API
  const mockTransactions: Transaction[] = [
    {
      hash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890",
      type: "receive",
      amount: "0.5",
      token: "ETH",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      from: "0x742c5b6666dd72d7ed63a4a3b7671c788b3f8ee8",
      to: address,
      status: "confirmed",
      gasUsed: "21000",
      gasPrice: "20"
    },
    {
      hash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
      type: "send",
      amount: "1.2",
      token: "ETH",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      from: address,
      to: "0x8ba1f109551bd432803012645hac136c45c2db2e",
      status: "confirmed",
      gasUsed: "21000",
      gasPrice: "25"
    },
    {
      hash: "0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
      type: "swap",
      amount: "100",
      token: "USDC",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      from: address,
      to: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d", // Uniswap V2 Router
      status: "confirmed",
      gasUsed: "150000",
      gasPrice: "30"
    },
    {
      hash: "0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      type: "contract",
      amount: "0.1",
      token: "ETH",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      from: address,
      to: "0xa0b86a33e6ba3e8c17b1be1e6b5b6c3f3e1e1e1e",
      status: "confirmed",
      gasUsed: "200000",
      gasPrice: "15"
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "receive":
        return <ArrowDown className="h-4 w-4 text-safe" />;
      case "send":
        return <ArrowUp className="h-4 w-4 text-danger" />;
      case "swap":
        return <ArrowUpDown className="h-4 w-4 text-primary" />;
      case "contract":
        return <Hash className="h-4 w-4 text-accent" />;
      default:
        return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-safe/20 text-safe border-safe/30";
      case "pending":
        return "bg-warning/20 text-warning border-warning/30";
      case "failed":
        return "bg-danger/20 text-danger border-danger/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const totalBalance = "2.75 ETH"; // Mock balance
  const totalUSDValue = "$6,875.23"; // Mock USD value

  return (
    <div className="space-y-6">
      {/* Balance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Wallet Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-bold text-primary">{totalBalance}</p>
              <p className="text-sm text-muted-foreground">{totalUSDValue}</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-bold">{mockTransactions.length}</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Last Activity</p>
              <p className="text-sm font-medium">
                {formatDistanceToNow(new Date(mockTransactions[0]?.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="send">Sent</TabsTrigger>
              <TabsTrigger value="receive">Received</TabsTrigger>
              <TabsTrigger value="swap">Swaps</TabsTrigger>
              <TabsTrigger value="contract">Contracts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-3 mt-4">
              {mockTransactions.map((tx) => (
                <div key={tx.hash} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(tx.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium capitalize">{tx.type}</p>
                        <Badge className={getStatusColor(tx.status)} variant="outline">
                          {tx.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Hash: {formatAddress(tx.hash)}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {tx.type === "receive" ? `From: ${formatAddress(tx.from)}` : `To: ${formatAddress(tx.to)}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-medium ${tx.type === "receive" ? "text-safe" : "text-danger"}`}>
                      {tx.type === "receive" ? "+" : "-"}{tx.amount} {tx.token}
                    </p>
                    {tx.gasUsed && (
                      <p className="text-xs text-muted-foreground">
                        Gas: {tx.gasUsed} ({tx.gasPrice} gwei)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>
            
            {["send", "receive", "swap", "contract"].map((type) => (
              <TabsContent key={type} value={type} className="space-y-3 mt-4">
                {mockTransactions
                  .filter((tx) => tx.type === type)
                  .map((tx) => (
                    <div key={tx.hash} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(tx.type)}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium capitalize">{tx.type}</p>
                            <Badge className={getStatusColor(tx.status)} variant="outline">
                              {tx.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Hash: {formatAddress(tx.hash)}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {tx.type === "receive" ? `From: ${formatAddress(tx.from)}` : `To: ${formatAddress(tx.to)}`}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-medium ${tx.type === "receive" ? "text-safe" : "text-danger"}`}>
                          {tx.type === "receive" ? "+" : "-"}{tx.amount} {tx.token}
                        </p>
                        {tx.gasUsed && (
                          <p className="text-xs text-muted-foreground">
                            Gas: {tx.gasUsed} ({tx.gasPrice} gwei)
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                {mockTransactions.filter((tx) => tx.type === type).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No {type} transactions found.
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}