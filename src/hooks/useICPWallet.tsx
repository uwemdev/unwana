import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ICPWalletContextType {
  isConnected: boolean;
  identity: Identity | null;
  principal: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isLoading: boolean;
  user: any;
}

const ICPWalletContext = createContext<ICPWalletContextType | null>(null);

export const useICPWallet = () => {
  const context = useContext(ICPWalletContext);
  if (!context) {
    throw new Error("useICPWallet must be used within ICPWalletProvider");
  }
  return context;
};

interface ICPWalletProviderProps {
  children: ReactNode;
}

export const ICPWalletProvider = ({ children }: ICPWalletProviderProps) => {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);

      if (await client.isAuthenticated()) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal().toString();
        
        setIdentity(identity);
        setPrincipal(principal);
        setIsConnected(true);
        
        // Create/update user in Supabase
        await handleUserLogin(principal);
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      toast({
        title: "Connection Error",
        description: "Failed to initialize wallet connection",
        variant: "destructive",
      });
    }
  };

  const handleUserLogin = async (walletAddress: string) => {
    try {
      // Set up Supabase auth session using the wallet address as user ID
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: `${walletAddress}@icp.wallet`,
        password: walletAddress, // Use wallet address as password for simplicity
      });

      if (authError) {
        // Try to sign up if login fails
        const { error: signUpError } = await supabase.auth.signUp({
          email: `${walletAddress}@icp.wallet`,
          password: walletAddress,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              wallet_address: walletAddress,
              wallet_type: "icp"
            }
          }
        });

        if (signUpError) {
          console.error("SignUp error:", signUpError);
        }
      }

      // Check if user exists in our users table
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress)
        .maybeSingle();

      if (!existingUser) {
        // Create new user
        const { data: newUser, error } = await supabase
          .from("users")
          .insert({
            wallet_address: walletAddress,
            wallet_type: "icp",
          })
          .select()
          .single();

        if (error) throw error;
        setUser(newUser);

        // Create session log
        try {
          await supabase.from("wallet_sessions").insert({
            user_id: newUser.id,
            wallet_address: walletAddress,
            session_start: new Date().toISOString(),
          });
        } catch (sessionError) {
          console.error("Session creation error:", sessionError);
        }
      } else {
        setUser(existingUser);

        // Create session log
        try {
          await supabase.from("wallet_sessions").insert({
            user_id: existingUser.id,
            wallet_address: walletAddress,
            session_start: new Date().toISOString(),
          });
        } catch (sessionError) {
          console.error("Session creation error:", sessionError);
        }
      }

    } catch (error) {
      console.error("Failed to handle user login:", error);
    }
  };

  const connect = async () => {
    if (!authClient) return;

    setIsLoading(true);
    try {
      await authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          
          setIdentity(identity);
          setPrincipal(principal);
          setIsConnected(true);
          
          await handleUserLogin(principal);
          
          toast({
            title: "Wallet Connected",
            description: `Connected with principal: ${principal.slice(0, 10)}...`,
          });
        },
        onError: (error) => {
          console.error("Login failed:", error);
          toast({
            title: "Connection Failed",
            description: "Failed to connect wallet",
            variant: "destructive",
          });
        },
      });
    } catch (error) {
      console.error("Failed to connect:", error);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    if (!authClient) return;

    try {
      // Update session end time
      if (user) {
        await supabase
          .from("wallet_sessions")
          .update({ session_end: new Date().toISOString() })
          .eq("user_id", user.id)
          .is("session_end", null);
      }

      await authClient.logout();
      setIsConnected(false);
      setIdentity(null);
      setPrincipal(null);
      setUser(null);
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error("Failed to disconnect:", error);
      toast({
        title: "Disconnection Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  const value: ICPWalletContextType = {
    isConnected,
    identity,
    principal,
    connect,
    disconnect,
    isLoading,
    user,
  };

  return (
    <ICPWalletContext.Provider value={value}>
      {children}
    </ICPWalletContext.Provider>
  );
};