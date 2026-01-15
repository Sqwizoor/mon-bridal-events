"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/CartContext";
import {
  Heart,
  ShoppingBag,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ChevronLeft,
  Sparkles,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const { isSignedIn } = useUser();

  const product = useQuery(api.products.getById, {
    id: productId as Id<"products">,
  });

  const relatedProducts = useQuery(api.products.get, {
    category: product?.category,
    limit: 4,
    isActive: true,
  });

  // Wishlist functionality
  const isWishlisted = useQuery(
    api.wishlist.isInWishlist,
    isSignedIn ? { productId: productId as Id<"products"> } : "skip"
  );
  const toggleWishlist = useMutation(api.wishlist.toggle);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleToggleWishlist = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to save items to your wishlist");
      return;
    }
    try {
      const result = await toggleWishlist({ productId: productId as Id<"products"> });
      if (result.added) {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  if (product === undefined) {
    return (
      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="text-muted-foreground mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    );
  }

  const imageUrl =
    product.imageUrl ||
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop";

  const isOutOfStock = product.stockQuantity <= 0;

  // Calculate active price
  const activePrice = product.isForHire ? (product.hirePrice || 0) : product.price;

  const isOnSale =
    product.isOnSale &&
    product.compareAtPrice &&
    product.compareAtPrice > activePrice;
  const discountPercent = isOnSale
    ? Math.round((1 - activePrice / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const filteredRelated = relatedProducts?.filter(
    (p) => p._id !== product._id
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link
            href={product.category === "jewelry" ? "/jewelry" : "/decor"}
            className="hover:text-foreground"
          >
            {product.category === "jewelry" ? "Jewelry" : "Decor"}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 sticky top-24">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-blue-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                )}
                {isOnSale && (
                  <Badge className="bg-red-500 text-white">
                    -{discountPercent}% Off
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-purple-500 text-white">Featured</Badge>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all ${
                  isWishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-600 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Additional Images Thumbnails (placeholder) */}
            {product.allImageUrls && product.allImageUrls.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.allImageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    className="w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-black transition-colors"
                  >
                    <img
                      src={url}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <Badge variant="outline" className="uppercase text-xs">
                {product.category === "jewelry"
                  ? product.jewelryType?.replace("_", " ") || "Jewelry"
                  : product.decorType?.replace("_", " ") || "Decor"}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold">
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 -mt-4 mb-4 text-sm">
               <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= (product.rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
                    />
                  ))}
               </div>
               <span className="text-muted-foreground font-medium ml-2">
                  {product.rating ? product.rating.toFixed(1) : "0.0"}
               </span>
               <span className="text-gray-300 mx-2">•</span>
               <a href="#reviews" className="text-blue-600 hover:underline">
                  {product.reviewCount || 0} Reviews
               </a>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                R{activePrice.toFixed(2)}
                {product.isForHire && (
                  <span className="text-lg font-normal text-muted-foreground">
                    /day
                  </span>
                )}
              </span>
              {isOnSale && product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  R{product.compareAtPrice.toFixed(2)}
                </span>
              )}
              {isOnSale && (
                <Badge className="bg-red-100 text-red-600">
                  Save R{(product.compareAtPrice! - activePrice).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Deposit Info for Hire Items */}
            {product.isForHire && product.depositAmount && (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Security Deposit:</span> R{product.depositAmount.toFixed(2)}
              </p>
            )}

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">
                  Color:{" "}
                  <span className="font-normal text-muted-foreground">
                    {selectedColor || "Select a color"}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-gray-300 shrink-0"
                        style={{ backgroundColor: color.hexCode || "#ccc" }}
                      />
                      <span className="text-sm font-medium">{color.name}</span>
                      {selectedColor === color.name && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">
                  Size:{" "}
                  <span className="font-normal text-muted-foreground">
                    {selectedSize || "Select a size"}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size.name)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        selectedSize === size.name
                          ? "border-black bg-black text-white"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {size.name}
                      {size.dimensions && (
                        <span className="text-xs ml-1 opacity-60">
                          ({size.dimensions})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Materials */}
            {product.materials && product.materials.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, idx) => (
                    <Badge key={idx} variant="secondary">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4 border-t">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setQuantity(Math.min(product.stockQuantity, quantity + 1))
                    }
                    disabled={quantity >= product.stockQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stockQuantity} available
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {isOutOfStock
                    ? "Out of Stock"
                    : product.isForHire
                    ? "Add to Quote"
                    : "Add to Cart"}
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Over R1,000</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% Protected</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">14 Day Policy</p>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="pt-4">
                <span className="text-sm text-muted-foreground">Tags: </span>
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="text-sm text-muted-foreground">
                    {tag}
                    {idx < product.tags!.length - 1 && ", "}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div id="reviews">
          <ProductReviews 
            productId={product._id} 
            productName={product.name} 
          />
        </div>

        {/* Related Products */}
        {filteredRelated && filteredRelated.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold">You May Also Like</h2>
              <Button variant="outline" asChild>
                <Link
                  href={product.category === "jewelry" ? "/jewelry" : "/decor"}
                >
                  View All
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filteredRelated.map((relatedProduct: any) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
