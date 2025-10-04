import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-glow shadow-glow hover:shadow-nft",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-primary/30 bg-card/50 text-primary hover:bg-primary/10 hover:border-primary/60 backdrop-blur-sm",
        secondary: "bg-gradient-to-r from-secondary to-secondary-glow text-secondary-foreground hover:shadow-mutation",
        ghost: "hover:bg-card-hover hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow",
        wallet: "bg-gradient-primary text-primary-foreground hover:scale-105 shadow-glow font-semibold",
        evolution: "bg-gradient-evolution text-foreground hover:animate-glow-pulse font-bold shadow-mutation",
        nft: "bg-card border border-primary/20 text-foreground hover:bg-card-hover hover:border-primary/40 hover:shadow-nft",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
