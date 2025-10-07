import { useState, useEffect } from "react";
import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Gavel, TrendingUp, Timer } from "lucide-react";
import apiClient from "@/lib/axios";

interface Auction {
  _id: string;
  nft: {
    _id: string;
    name: string;
    picture: string;
    tags: string[];
  };
  seller: {
    username: string;
  };
  currentPrice: number;
  endTime: string;
  bids: any[];
}

export default function Auctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");

  const fetchAuctions = async () => {
    try {
      const response = await apiClient.get("/api/auctions/my-auctions");
      if (response.data.success) {
        setAuctions(response.data.auctions);
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handlePlaceBid = async (auctionId: string) => {
    try {
      const response = await apiClient.post("/api/auctions/bid", {
        auctionId,
        bidAmount: parseFloat(bidAmount),
      });
      if (response.data.success) {
        fetchAuctions();
        setBidAmount("");
        setSelectedAuction(null);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  const getTimeLeft = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return "Auction ended";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h left`;
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
  };

  const getTimeColor = (timeLeft: string) => {
    if (timeLeft.includes("h") && !timeLeft.includes("d")) {
      const hours = parseInt(timeLeft);
      if (hours < 3) return "text-destructive";
      if (hours < 12) return "text-orange-400";
    }
    return "text-accent";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-evolution bg-clip-text text-transparent">
            My Auctions
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your ongoing auctions
          </p>
        </div>

        {/* Auction Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-card border border-primary/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{auctions.length}</div>
            <div className="text-sm text-muted-foreground">Active Auctions</div>
          </div>
          <div className="bg-gradient-card border border-secondary/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">
              {auctions.reduce((sum, auction) => sum + auction.bids.length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Bids</div>
          </div>
          <div className="bg-gradient-card border border-accent/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {auctions.reduce((sum, auction) => sum + auction.currentPrice, 0).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">ETH Volume</div>
          </div>
          <div className="bg-gradient-card border border-primary/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {Math.max(...auctions.map(a => a.currentPrice), 0).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Highest Bid</div>
          </div>
        </div>

        {/* Filter Options */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
            <Clock className="h-3 w-3 mr-1" />
            Ending Soon
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
            <TrendingUp className="h-3 w-3 mr-1" />
            Most Bids
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
            <Gavel className="h-3 w-3 mr-1" />
            Highest Value
          </Badge>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {auctions.map((auction) => (
            <div key={auction._id} className="group">
              <div className="relative">
                {/* Auction Timer Badge */}
                <div className="absolute top-3 left-3 z-10 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                  <Timer className="h-3 w-3 text-accent" />
                  <span className={`text-xs font-medium ${getTimeColor(getTimeLeft(auction.endTime))}`}>
                    {getTimeLeft(auction.endTime)}
                  </span>
                </div>

                {/* Bid Count Badge */}
                <div className="absolute top-3 right-3 z-10 bg-primary/90 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-xs font-medium text-primary-foreground">
                    {auction.bids.length} bids
                  </span>
                </div>

                <NFTCard
                  id={auction.nft._id}
                  name={auction.nft.name}
                  image={auction.nft.picture.replace("ipfs://", "https://ipfs.io/ipfs/")}
                  price={auction.currentPrice.toString()}
                  tags={auction.nft.tags}
                  owner={auction.seller.username}
                  actionLabel="Place Bid"
                  onAction={() => setSelectedAuction(auction._id)}
                  evolutionHistory={[]}
                />
              </div>

              {/* Bid Input (shown when auction is selected) */}
              {selectedAuction === auction._id && (
                <div className="mt-4 p-4 bg-gradient-card border border-primary/30 rounded-lg space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Current highest bid: <span className="text-primary font-semibold">{auction.currentPrice} ETH</span>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Bid amount (ETH)"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="flex-1 bg-background border-primary/30"
                    />
                    <Button
                      onClick={() => handlePlaceBid(auction._id)}
                      disabled={!bidAmount || parseFloat(bidAmount) <= auction.currentPrice}
                      variant="default"
                    >
                      <Gavel className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAuction(null)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {auctions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center opacity-50">
              <Gavel className="h-12 w-12 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No Active Auctions</h3>
            <p className="text-muted-foreground mb-6">
              You have not created any auctions yet.
            </p>
            <Button variant="outline">
              Create Auction
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
