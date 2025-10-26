import { useState } from "react";
import apiClient from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Zap, Loader2, Sparkles, Gavel, Heart } from "lucide-react";
import { isAxiosError } from "axios";

interface MutationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNftUpdate: () => void;
  nft: {
    id: string;
    name: string;
    image: string;
    tags: string[];
  } | null;
}

export const MutationModal = ({ isOpen, onClose, nft, onNftUpdate }: MutationModalProps) => {
  const [newTags, setNewTags] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [showDecision, setShowDecision] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleGenerate = async () => {
    if (!nft || isRateLimited) return;

    console.log("🚀 [EVOLVE DEBUG] Full evolution process started for:", nft.name);
    setIsGenerating(true);
    setIsRateLimited(true);

    setTimeout(() => {
      setIsRateLimited(false);
    }, 60000); // 60 second cooldown

    try {
      const evolutionPayload = {
        nftId: nft.id,
        name: nft.name,
        base_tags: nft.tags,
        image: nft.image,
        max_new_tags: 3,
      };
      console.log("📦 [EVOLVE DEBUG] Sending payload for full evolution:", JSON.stringify(evolutionPayload, null, 2));

      const response = await apiClient.post('/api/evolve-prompt', evolutionPayload);

      console.log("✅ [EVOLVE DEBUG] SUCCESS: Evolution complete.");
      if (response.data.updatedNft) {
        console.log("🖼️ [EVOLVE DEBUG] Evolved NFT data:", response.data.updatedNft);
        setGeneratedImage(response.data.updatedNft.picture);
        setGeneratedTags(response.data.updatedNft.tags);
      } else if (response.data.imageData) {
        console.log("🖼️ [EVOLVE DEBUG] Received image data.");
        // Assuming the backend sends a base64 string
        const imageSrc = `data:image/jpeg;base64,${response.data.imageData}`;
        setGeneratedImage(imageSrc);
        setGeneratedTags(response.data.generatedTags);
      }
      setShowDecision(true);

    } catch (error) {
      console.error("❌ [EVOLVE DEBUG] ERROR: Evolution process failed.");
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (isAxiosError(error) && error.response) {
        console.error("💀 [EVOLVE DEBUG] Axios error details:", {
          message: error.message,
          code: error.code,
          status: error.response.status,
          data: error.response.data,
        });

        // Check for the specific insufficient balance error
        const errorDetails = error.response.data?.details?.error;
        if (typeof errorDetails === 'string' && errorDetails.includes("insufficient_balance")) {
          errorMessage = "Image evolution failed due to insufficient funds with the provider. Please contact support.";
        } else {
          errorMessage = error.response.data?.message || "An error occurred during evolution.";
        }
      } else {
        console.error("💀 [EVOLVE DEBUG] Non-Axios error details:", error);
      }

      alert(errorMessage); // Using alert as a fallback for user notification

    } finally {
      setIsGenerating(false);
    }
  };

  const resetModal = () => {
    setNewTags("");
    setIsGenerating(false);
    setGeneratedImage(null);
    setGeneratedTags([]);
    setShowDecision(false);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const handleKeep = async () => {
    if (!nft || !generatedImage || generatedTags.length === 0) return;

    try {
      const evolutionPayload = {
        nftId: nft.id,
        newImage: generatedImage,
        newTags: generatedTags,
      };

      await apiClient.post('/api/nfts/evolve', evolutionPayload);
      onNftUpdate();
      handleClose();
    } catch (error) {
      console.error("Error keeping NFT:", error);
    }
  };

  const handleAuction = async () => {
    if (!nft || !generatedImage || generatedTags.length === 0) return;

    try {
      // First, evolve the NFT
      const evolutionPayload = {
        nftId: nft.id,
        newImage: generatedImage,
        newTags: generatedTags,
      };
      const evolveResponse = await apiClient.post('/api/nfts/evolve', evolutionPayload);
      const updatedNft = evolveResponse.data.nft;

      // Then, create the auction with the evolved NFT
      // TODO: Add a form to get starting price and end time from the user
      const startingPrice = 1; // Hardcoded for now
      const endTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

      const auctionPayload = {
        nftId: updatedNft._id,
        startingPrice,
        endTime,
      };

      await apiClient.post('/api/auctions/create', auctionPayload);
      onNftUpdate();
      handleClose();
    } catch (error) {
      console.error("Error creating auction:", error);
    }
  };

  if (!nft) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl bg-gradient-card border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-evolution bg-clip-text text-transparent">
            Evolve Your NFT
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add new characteristics to evolve "{nft.name}" into something unique
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original NFT */}
          <div className="flex space-x-4">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-32 h-32 rounded-lg object-cover border border-primary/30"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{nft.name}</h3>
              <div className="flex flex-wrap gap-1">
                {nft.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Evolution Input */}
          {!isGenerating && !generatedImage && (
            <div className="space-y-4">
          
              <Button
                onClick={handleGenerate}
                variant="evolution"
                className="w-full"
                disabled={isRateLimited}
              >
                <Zap className="h-4 w-4" />
                {isRateLimited ? "Cooldown..." : "Begin Evolution"}
              </Button>
            </div>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <div className="text-center space-y-4 py-8">
              <div className="relative mx-auto w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-primary">Evolution in Progress...</p>
                <p className="text-muted-foreground">AI is generating your evolved NFT</p>
              </div>
            </div>
          )}

          {/* Generated Result */}
          {generatedImage && showDecision && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-primary">Evolution Complete!</h3>
                <div className="relative inline-block">
                  <img
                    src={generatedImage}
                    alt="Evolved NFT"
                    className="w-48 h-48 rounded-lg object-cover border-2 border-primary shadow-glow"
                  />
                  <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleKeep} variant="outline" className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>Keep Evolution</span>
                </Button>
                <Button onClick={handleAuction} variant="secondary" className="flex items-center space-x-2">
                  <Gavel className="h-4 w-4" />
                  <span>Auction It</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};