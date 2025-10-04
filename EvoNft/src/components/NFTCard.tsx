import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Zap, Clock, User } from "lucide-react";

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  price?: string;
  tags: string[];
  owner?: string;
  isOwned?: boolean;
  onAction?: () => void;
  actionLabel?: string;
  timeLeft?: string;
}

export const NFTCard = ({
  id,
  name,
  image,
  price,
  tags,
  owner,
  isOwned = false,
  onAction,
  actionLabel = "Buy Now",
  timeLeft
}: NFTCardProps) => {
  return (
    <Card className="group overflow-hidden border-primary/20 bg-gradient-card hover:border-primary/40 hover:shadow-nft transition-all duration-300 hover:scale-105">
      <CardHeader className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {timeLeft && (
            <div className="absolute top-3 right-3 bg-secondary/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span className="text-xs font-medium">{timeLeft}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2 truncate">{name}</h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-primary/10 text-primary border-primary/30"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Price and Owner */}
        <div className="flex items-center justify-between text-sm">
          {price && (
            <div className="flex items-center space-x-1">
              <span className="text-primary font-bold">{price} ETH</span>
            </div>
          )}
          {owner && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate max-w-20">{owner}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {onAction && (
          <Button
            onClick={onAction}
            variant={isOwned ? "evolution" : "default"}
            className="w-full"
          >
            {isOwned && <Zap className="h-4 w-4" />}
            {actionLabel}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};