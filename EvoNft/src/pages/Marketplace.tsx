import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { NFTCard } from "@/components/NFTCard";
import { Search, Filter, TrendingUp, Grid, List } from "lucide-react";
import cyberPhoenixImg from "@/assets/cyber-phoenix.jpg";
import digitalDragonImg from "@/assets/digital-dragon.jpg";
import neonWolfImg from "@/assets/neon-wolf.jpg";

const mockNFTs = [
  {
    id: "1",
    name: "Cyber Phoenix",
    image: cyberPhoenixImg,
    price: "2.5",
    tags: ["cyber", "phoenix", "glowing", "rare"],
    owner: "0x1a2b...3c4d"
  },
  {
    id: "2", 
    name: "Digital Dragon",
    image: digitalDragonImg,
    price: "1.8",
    tags: ["dragon", "digital", "ethereal"],
    owner: "0x5e6f...7g8h"
  },
  {
    id: "3",
    name: "Neon Wolf",
    image: neonWolfImg, 
    price: "3.2",
    tags: ["wolf", "neon", "wild", "legendary"],
    owner: "0x9i0j...1k2l"
  },
  {
    id: "4",
    name: "Crystal Cat",
    image: "/placeholder.svg",
    price: "1.2",
    tags: ["crystal", "cat", "mystical"],
    owner: "0xab1c...2d3e"
  },
  {
    id: "5",
    name: "Thunder Eagle",
    image: "/placeholder.svg",
    price: "4.1",
    tags: ["thunder", "eagle", "storm", "epic"],
    owner: "0xef4g...5h6i"
  },
  {
    id: "6",
    name: "Shadow Panther",
    image: "/placeholder.svg",
    price: "2.9",
    tags: ["shadow", "panther", "stealth"],
    owner: "0xjk7l...8m9n"
  }
];

const popularTags = ["cyber", "digital", "glowing", "ethereal", "neon", "crystal", "legendary", "rare", "epic"];

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("price-low");

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredNFTs = mockNFTs.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => nft.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-evolution bg-clip-text text-transparent">
            NFT Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover and collect unique evolved NFTs from creators worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search NFTs by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-primary/30 focus:border-primary"
            />
          </div>

          {/* Filter Tags */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">Filter by Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedTags.includes(tag)
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "hover:bg-primary/10 hover:border-primary/60"
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {filteredNFTs.length} NFTs
              </span>
              {selectedTags.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTags([])}
                  className="text-primary"
                >
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredNFTs.map((nft) => (
            <NFTCard
              key={nft.id}
              {...nft}
              actionLabel="Buy Now"
              onAction={() => console.log('Buy NFT:', nft.id)}
            />
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center opacity-50">
              <Search className="h-12 w-12 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No NFTs Found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedTags([]);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}