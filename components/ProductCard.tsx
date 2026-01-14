"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/CartContext";
import { Heart, ShoppingBag, Eye, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: "jewelry" | "decor";
  jewelryType?: string;
  decorType?: string;
  colors?: Array<{ name: string; hexCode?: string }>;
  materials?: string[];
  imageUrl?: string | null;
  imageStorageId?: string;
  stockQuantity?: number;
  isForHire?: boolean;
  hirePrice?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export default function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const imageUrl = product.imageUrl || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop";
  const isOutOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;

  // Determine the correct price to display and use for calculations
  const activePrice = product.isForHire ? (product.hirePrice || 0) : product.price;
  
  const isOnSale = product.isOnSale && product.compareAtPrice && product.compareAtPrice > activePrice;
  const discountPercent = isOnSale 
    ? Math.round((1 - activePrice / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <Card 
      className="overflow-hidden flex flex-col h-full group border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white p-0 gap-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product._id}`} className="flex flex-col h-full cursor-pointer">
        {/* Image Container */}
        <div className="p-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay on hover */}
            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              {product.isNew && (
                <Badge className="bg-blue-500 hover:bg-blue-600 text-[10px] px-1.5 py-0 font-medium">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  New
                </Badge>
              )}
              {isOnSale && (
                <Badge className="bg-red-500 hover:bg-red-600 text-[10px] px-1.5 py-0 font-medium">
                  -{discountPercent}%
                </Badge>
              )}

              {isOutOfStock && (
                <Badge variant="secondary" className="bg-gray-800 text-white text-[10px] px-1.5 py-0 font-medium">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 cursor-pointer z-10 ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-3 pb-3 pt-0 flex flex-col">
          {/* Product Name */}
          <h3 className="font-serif text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary transition-colors mt-1">
            {product.name}
          </h3>

          {/* Price & Cart */}
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-base font-bold text-gray-900">
              R{activePrice.toFixed(2)}
              {product.isForHire && <span className="text-xs font-normal text-muted-foreground">/day</span>}
            </span>
            <Button
              size="icon"
              variant="secondary"
              className="h-7 w-7 rounded-full shrink-0 bg-gray-100 hover:bg-gray-200 text-black"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
