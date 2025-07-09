
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut, User } from "lucide-react";
import { useICPWallet } from "@/hooks/useICPWallet";

export default function WalletConnection() {
  const { isConnected, principal, connect, disconnect, isLoading, user } = useICPWallet();

  if (isConnected && principal) {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-yellow-400" />
          <Badge variant="secondary" className="font-mono text-xs border-yellow-400/30 hidden sm:inline-flex">
            {principal.slice(0, 8)}...{principal.slice(-8)}
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs border-yellow-400/30 sm:hidden">
            {principal.slice(0, 4)}...
          </Badge>
        </div>
        {user?.display_name && (
          <span className="text-sm text-muted-foreground hidden md:block">
            {user.display_name}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={disconnect}
          className="gap-2 border-yellow-400/30 hover:border-yellow-400/50 hover:bg-yellow-400/10"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connect}
      disabled={isLoading}
      className="gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-medium"
    >
      <Wallet className="h-4 w-4" />
      <span className="hidden sm:inline">{isLoading ? "Connecting..." : "Connect Wallet"}</span>
      <span className="sm:hidden">{isLoading ? "..." : "Connect"}</span>
    </Button>
  );
}
