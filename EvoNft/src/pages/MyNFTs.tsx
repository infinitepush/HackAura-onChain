import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NFTCard } from "@/components/NFTCard";
import { MutationModal } from "@/components/MutationModal";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Plus, TrendingUp, History, CreditCard, Upload } from "lucide-react";
import apiClient from "@/lib/axios";

// Define the type for our NFT data
interface Nft {
  _id: string;
  name: string;
  picture: string;
  tags: string[];
  evolutionHistory: any[];
  evolutionCount?: number; // Optional as it's not in the backend schema
}

// Define the type for the NFT card props, which is slightly different
interface NftCardProps {
  id: string;
  name: string;
  image: string;
  tags: string[];
  evolutionCount: number;
  evolutionHistory: any[];
}


export default function MyNFTs() {
  const [ownedNfts, setOwnedNfts] = useState<Nft[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NftCardProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedNftHistory, setSelectedNftHistory] = useState<any[]>([]);

  const [newNFT, setNewNFT] = useState<{
    name: string;
    tags: string;
    image: string;
    file: File | null;
  }>({
    name: "",
    tags: "",
    image: "",
    file: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMyNfts = async () => {
    try {
      const response = await apiClient.get('/api/nfts/my-nfts');
      if (response.data.success) {
        setOwnedNfts(response.data.nfts);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      // Optionally, show a toast notification to the user
    }
  };

  useEffect(() => {
    fetchMyNfts();
  }, []);

  const handleEvolveNFT = (nft: NftCardProps) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
  };

  const handleHistoryClick = (nft: NftCardProps) => {
    setSelectedNftHistory(nft.evolutionHistory);
    setIsHistoryModalOpen(true);
  };

  const handleCreateNFT = () => {
    setIsCreateModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewNFT({ ...newNFT, image: event.target.result as string, file });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSubmit = async () => {
    if (!newNFT.file || !newNFT.name) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", newNFT.file);
    formData.append("name", newNFT.name);
    formData.append("description", newNFT.name); // Optional: separate field later

    const attributes = newNFT.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    if (attributes.length > 0) {
      formData.append("attributes", JSON.stringify(attributes));
    }

    try {
      // Step 1: Upload image to our backend, which handles IPFS
      const uploadResponse = await apiClient.post("/upload-image", formData);

      if (uploadResponse.status !== 200) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }

      const uploadData = uploadResponse.data;
      console.log("✅ Image uploaded successfully:", uploadData);
      console.log("📊 Analysis Result:", uploadData.analysis);

      // Step 2: Save NFT data to our backend
      const nftDataToSave = {
        name: newNFT.name,
        tags: attributes,
        picture: uploadData.metadata.image, // Use the IPFS link from the response
      };

      const saveResponse = await apiClient.post('/api/nfts/create', nftDataToSave);

      if (saveResponse.data.success) {
        console.log("✅ NFT saved to backend successfully:", saveResponse.data.nft);
        // Refresh NFT list
        fetchMyNfts();
        // Reset form and close modal
        setNewNFT({ name: "", tags: "", image: "", file: null });
        setIsCreateModalOpen(false);
      } else {
        throw new Error(saveResponse.data.message || "Failed to save NFT to backend.");
      }

    } catch (error) {
      console.error("❌ Error creating NFT:", error);
      alert("Failed to create NFT. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const totalEvolutions = ownedNfts.reduce(
    (sum, nft) => sum + (nft.evolutionCount || 0),
    0
  );
  
  // Map backend data to the format expected by NFTCard
  const formattedNfts: NftCardProps[] = ownedNfts.map(nft => ({
    id: nft._id,
    name: nft.name,
    image: nft.picture.replace("ipfs://", "https://ipfs.io/ipfs/"), // Convert IPFS URI to HTTP URL
    tags: nft.tags,
    evolutionCount: nft.evolutionHistory.length,
    evolutionHistory: nft.evolutionHistory,
  }));


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-evolution bg-clip-text text-transparent">
            My NFT Collection
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Manage and evolve your digital collectibles
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-card border border-primary/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {ownedNfts.length}
              </div>
              <div className="text-sm text-muted-foreground">NFTs Owned</div>
            </div>
            <div className="bg-gradient-card border border-secondary/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1">
                {totalEvolutions}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Evolutions
              </div>
            </div>
            <div className="bg-gradient-card border border-accent/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">12.5</div>
              <div className="text-sm text-muted-foreground">ETH Value</div>
            </div>
            <div className="bg-gradient-card border border-primary/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">+24%</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Button variant="wallet" className="flex items-center space-x-2" onClick={handleCreateNFT}>
            <Plus className="h-4 w-4" />
            <span>Create Nfts</span>
          </Button>

          <Button variant="outline" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Buy More NFTs</span>
          </Button>
        </div>

        {/* NFT Collection */}
        {formattedNfts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {formattedNfts.map((nft) => (
              <div key={nft.id} className="relative">
                {nft.evolutionCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-secondary to-secondary-glow text-secondary-foreground shadow-mutation"
                  >
                    {nft.evolutionCount} Evolution
                    {nft.evolutionCount !== 1 ? "s" : ""}
                  </Badge>
                )}
                <NFTCard
                  {...nft}
                  isOwned={true}
                  actionLabel="Evolve NFT"
                  onAction={() => handleEvolveNFT(nft)}
                  onHistoryClick={() => handleHistoryClick(nft)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center opacity-50">
              <Zap className="h-12 w-12 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              No NFTs Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start your collection by creating a new NFT or purchasing from the marketplace.
            </p>
            <Button variant="wallet" onClick={handleCreateNFT}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First NFT
            </Button>
          </div>
        )}

        {/* Evolution Tips */}
        <div className="mt-12 bg-gradient-card border border-primary/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Evolution Tips
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Add descriptive tags to guide the AI evolution process</li>
            <li>• Each evolution creates a unique, one-of-a-kind variant</li>
            <li>
              • You can auction evolved NFTs or keep them in your collection
            </li>
            <li>
              • Rare traits have higher chances of creating valuable evolutions
            </li>
          </ul>
        </div>
      </div>

      {/* Create NFT Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md bg-gradient-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Create New NFT
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Upload an image and add details for your new NFT
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="nft-image" className="text-foreground">
                NFT Image
              </Label>
              <div className="flex items-center space-x-4">
                {newNFT.image ? (
                  <img 
                    src={newNFT.image} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-lg object-cover border border-primary/30"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg border border-dashed border-primary/30 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="nft-name" className="text-foreground">
                NFT Name
              </Label>
              <Input
                id="nft-name"
                placeholder="Enter NFT name"
                value={newNFT.name}
                onChange={(e) => setNewNFT({ ...newNFT, name: e.target.value })}
                className="bg-card border-primary/30 focus:border-primary"
              />
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <Label htmlFor="nft-tags" className="text-foreground">
                Tags (comma separated)
              </Label>
              <Input
                id="nft-tags"
                placeholder="e.g., art, digital, collectible"
                value={newNFT.tags}
                onChange={(e) => setNewNFT({ ...newNFT, tags: e.target.value })}
                className="bg-card border-primary/30 focus:border-primary"
              />
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleCreateSubmit}
              disabled={!newNFT.name || !newNFT.image || isUploading}
              className="w-full mt-4"
            >
              {isUploading ? "Uploading & Creating..." : "Create NFT"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mutation Modal */}
      <MutationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNftUpdate={fetchMyNfts}
        nft={selectedNFT}
      />

      {/* History Modal */}
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="max-w-md bg-gradient-card border-primary/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              Evolution History
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedNftHistory.map((evolution, index) => (
              <div key={index} className="flex items-center space-x-4">
                <img
                  src={evolution.picture.replace("ipfs://", "https://ipfs.io/ipfs/")}
                  alt={`Evolution ${index + 1}`}
                  className="w-16 h-16 rounded-lg object-cover border border-primary/30"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1">
                    {evolution.tags.map((tag: string, tagIndex: number) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
