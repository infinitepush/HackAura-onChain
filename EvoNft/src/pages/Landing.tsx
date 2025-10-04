import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NFTCard } from "@/components/NFTCard";
import { Zap, Palette, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import cyberPhoenixImg from "@/assets/cyber-phoenix.jpg";
import digitalDragonImg from "@/assets/digital-dragon.jpg";
import neonWolfImg from "@/assets/neon-wolf.jpg";

const trendingNFTs = [
  {
    id: "1",
    name: "Cyber Phoenix",
    image: cyberPhoenixImg,
    price: "2.5",
    tags: ["cyber", "phoenix", "glowing"],
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
    tags: ["wolf", "neon", "wild"],
    owner: "0x9i0j...1k2l"
  }
];

const features = [
  {
    icon: Zap,
    title: "AI-Powered Evolution",
    description: "Transform your NFTs with cutting-edge AI technology that creates unique evolutionary variants."
  },
  {
    icon: Palette,
    title: "Infinite Creativity",
    description: "Each evolution is one-of-a-kind, generated based on your NFT's characteristics and new traits."
  },
  {
    icon: TrendingUp,
    title: "Dynamic Marketplace",
    description: "Trade evolved NFTs in our vibrant marketplace with real-time valuation and trending insights."
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <Badge variant="outline" className="text-primary border-primary/30 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                Next-Gen NFT Evolution
              </Badge>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-evolution bg-clip-text text-transparent leading-tight">
              Evolve Your NFTs with AI
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your digital collectibles into unique evolutionary variants using advanced AI. 
              Create, trade, and auction one-of-a-kind NFTs that grow with your imagination.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/marketplace">
                <Button variant="wallet" size="lg" className="text-lg px-8 py-6">
                  <Zap className="h-5 w-5" />
                  Start Exploring
                </Button>
              </Link>
              <Link to="/my-nfts">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  View Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Revolutionizing Digital Ownership
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the future of NFTs with our innovative evolution platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center p-8 rounded-xl bg-gradient-card border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-nft group"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary mb-6 group-hover:animate-glow-pulse">
                    <Icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending NFTs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Trending Evolutions</h2>
              <p className="text-muted-foreground text-lg">Discover the most popular evolved NFTs in our marketplace</p>
            </div>
            <Link to="/marketplace">
              <Button variant="ghost" className="text-primary hover:text-primary-glow">
                View All
                <TrendingUp className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                {...nft}
                actionLabel="View Details"
                onAction={() => console.log('View NFT:', nft.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Evolve Your Collection?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are transforming their NFTs with AI-powered evolution
          </p>
          <Button variant="wallet" size="lg" className="text-lg px-8 py-6 animate-glow-pulse">
            <Zap className="h-5 w-5" />
            Connect Wallet & Start
          </Button>
        </div>
      </section>
    </div>
  );
}