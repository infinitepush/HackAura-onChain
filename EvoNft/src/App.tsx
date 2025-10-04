import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext"; // Correct import for AuthProvider
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Marketplace from "./pages/Marketplace";
import MyNFTs from "./pages/MyNFTs";
import Auctions from "./pages/Auctions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-nfts"
                element={
                  <ProtectedRoute>
                    <MyNFTs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auctions"
                element={
                  <ProtectedRoute>
                    <Auctions />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
