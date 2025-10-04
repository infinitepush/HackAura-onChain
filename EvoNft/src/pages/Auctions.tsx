import { useState } from "react";
import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Gavel, TrendingUp, Timer } from "lucide-react";
import cyberPhoenixImg from "@/assets/cyber-phoenix.jpg";
import digitalDragonImg from "@/assets/digital-dragon.jpg";
import neonWolfImg from "@/assets/neon-wolf.jpg";
import mysticOwlImg from "@/assets/mystic-owl.jpg";

const mockAuctions = [
  {
    id: "auction-1",
    name: "Evolved Cyber Phoenix",
    image: cyberPhoenixImg,
    tags: ["cyber", "phoenix", "evolved", "rare"],
    currentBid: "3.2",
    timeLeft: "2h 34m",
    bidCount: 12,
    owner: "0x1a2b...3c4d"
  },
  {
    id: "auction-2",
    name: "Mutated Digital Dragon",
    image: digitalDragonImg,
    tags: ["dragon", "mutated", "legendary"],
    currentBid: "5.8",
    timeLeft: "1d 12h",
    bidCount: 28,
    owner: "0x5e6f...7g8h"
  },
  {
    id: "auction-3",
    name: "Enhanced Neon Wolf",
    image: neonWolfImg,
    tags: ["wolf", "enhanced", "glowing"],
    currentBid: "2.1",
    timeLeft: "6h 18m",
    bidCount: 8,
    owner: "0x9i0j...1k2l"
  },
  {
    id: "auction-4",
    name: "Transformed Crystal Cat",
    image: mysticOwlImg,
    tags: ["crystal", "transformed", "mystical"],
    currentBid: "1.9",
    timeLeft: "23h 45m",
    bidCount: 15,
    owner: "0xab1c...2d3e"
  }
];

export default function Auctions() {
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");

  const handlePlaceBid = (auctionId: string) => {
    console.log(`Placing bid of ${bidAmount} ETH on auction ${auctionId}`);
    setBidAmount("");
    setSelectedAuction(null);
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
            Live Auctions
          </h1>
          <p className="text-muted-foreground text-lg">
            Bid on rare evolved NFTs from the community
          </p>
        </div>

        {/* Auction Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-card border border-primary/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{mockAuctions.length}</div>
            <div className="text-sm text-muted-foreground">Active Auctions</div>
          </div>
          <div className="bg-gradient-card border border-secondary/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">
              {mockAuctions.reduce((sum, auction) => sum + auction.bidCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Bids</div>
          </div>
          <div className="bg-gradient-card border border-accent/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">24.8</div>
            <div className="text-sm text-muted-foreground">ETH Volume</div>
          </div>
          <div className="bg-gradient-card border border-primary/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {Math.max(...mockAuctions.map(a => parseFloat(a.currentBid))).toFixed(1)}
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
          {mockAuctions.map((auction) => (
            <div key={auction.id} className="group">
              <div className="relative">
                {/* Auction Timer Badge */}
                <div className="absolute top-3 left-3 z-10 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                  <Timer className="h-3 w-3 text-accent" />
                  <span className={`text-xs font-medium ${getTimeColor(auction.timeLeft)}`}>
                    {auction.timeLeft}
                  </span>
                </div>

                {/* Bid Count Badge */}
                <div className="absolute top-3 right-3 z-10 bg-primary/90 backdrop-blur-sm rounded-lg px-2 py-1">
                  <span className="text-xs font-medium text-primary-foreground">
                    {auction.bidCount} bids
                  </span>
                </div>

                <NFTCard
                  id={auction.id}
                  name={auction.name}
                  image={auction.image}
                  price={auction.currentBid}
                  tags={auction.tags}
                  owner={auction.owner}
                  actionLabel="Place Bid"
                  onAction={() => setSelectedAuction(auction.id)}
                />
              </div>

              {/* Bid Input (shown when auction is selected) */}
              {selectedAuction === auction.id && (
                <div className="mt-4 p-4 bg-gradient-card border border-primary/30 rounded-lg space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Current highest bid: <span className="text-primary font-semibold">{auction.currentBid} ETH</span>
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
                      onClick={() => handlePlaceBid(auction.id)}
                      disabled={!bidAmount || parseFloat(bidAmount) <= parseFloat(auction.currentBid)}
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
        {mockAuctions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center opacity-50">
              <Gavel className="h-12 w-12 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No Active Auctions</h3>
            <p className="text-muted-foreground mb-6">
              Check back later for new evolved NFT auctions
            </p>
            <Button variant="outline">
              View Marketplace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}