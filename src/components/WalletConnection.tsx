
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut, User } from "lucide-react";
import { useICPWallet } from "@/hooks/useICPWallet";

export default function WalletConnection() {
  const { isConnected, principal, connect, disconnect, isLoading, user } = useICPWallet();

  if (isConnected && principal) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-yellow-400/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-yellow-400" />
                <Badge variant="secondary" className="font-mono text-xs border-yellow-400/30">
                  {principal.slice(0, 8)}...{principal.slice(-8)}
                </Badge>
              </div>
              {user?.display_name && (
                <span className="text-sm text-muted-foreground">
                  {user.display_name}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnect}
              className="gap-2 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10"
            >
              <LogOut className="h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-yellow-400/20">
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span className="text-sm">Connect your ICP wallet to start scanning</span>
          </div>
          <Button
            onClick={connect}
            disabled={isLoading}
            className="gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-medium"
          >
            <Wallet className="h-4 w-4" />
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
