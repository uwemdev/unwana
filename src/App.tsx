import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ICPWalletProvider } from "@/hooks/useICPWallet";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Community from "./pages/Community";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Copyright from "./pages/Copyright";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ICPWalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen w-full bg-gradient-to-br from-background to-background/80">
            <Navigation />
            <main className="container mx-auto px-4 py-4 max-w-7xl pb-safe">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/community" element={<Community />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/results" element={<Results />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/copyright" element={<Copyright />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ICPWalletProvider>
  </QueryClientProvider>
);

export default App;
