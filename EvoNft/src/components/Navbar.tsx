import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Zap, Wallet, User, LogOut, ShoppingBag, Gavel } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: "Marketplace", path: "/marketplace", icon: ShoppingBag },
    { label: "My NFTs", path: "/my-nfts", icon: User },
    { label: "Auctions", path: "/auctions", icon: Gavel },
  ];

  useEffect(() => {
    console.log("Navbar rendered. User:", user, "isAuthenticated:", isAuthenticated);
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/') {
      // Optional: Redirect to home page after logout if not already there.
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EvoNFT</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "text-primary bg-primary/10 shadow-glow" 
                      : "text-muted-foreground hover:text-primary hover:bg-card-hover"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.name || user?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/my-nfts')}>
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { logout(); navigate('/'); }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="wallet" 
                className="flex items-center space-x-2"
                onClick={() => navigate('/auth')}
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-sm border-primary/20">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Mobile Navigation Links */}
                  <div className="space-y-3">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                            isActive 
                              ? "text-primary bg-primary/10 shadow-glow" 
                              : "text-muted-foreground hover:text-primary hover:bg-card-hover"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-lg">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Mobile Auth Section */}
                  <div className="pt-6 border-t border-primary/20">
                    {isAuthenticated ? (
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center space-x-2"
                          onClick={() => { navigate('/my-nfts'); setIsOpen(false); }}
                        >
                          <User className="h-4 w-4" />
                          <span>{user?.name || user?.email}</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="w-full flex items-center space-x-2"
                          onClick={() => { logout(); navigate('/'); setIsOpen(false); }}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="wallet" 
                        className="w-full flex items-center space-x-2"
                        onClick={() => { navigate('/auth'); setIsOpen(false); }}
                      >
                        <User className="h-4 w-4" />
                        <span>Sign In</span>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};