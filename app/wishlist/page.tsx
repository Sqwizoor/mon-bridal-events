"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { toast } from "sonner";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function WishlistPage() {
  const wishlistItems = useQuery(api.wishlist.get);
  const removeFromWishlist = useMutation(api.wishlist.remove);
  const { addToCart } = useCart();

  const handleRemove = async (productId: any) => {
    try {
      await removeFromWishlist({ productId });
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success("Added to cart");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-400 fill-red-400" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-gray-400 max-w-xl">
            Items you've saved for later. Add them to your cart when you're ready to purchase.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <SignedOut>
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Sign in to view your wishlist</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Create an account or sign in to save your favorite items and access them anytime.
            </p>
            <SignInButton mode="modal">
              <Button size="lg" className="px-8">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          {wishlistItems === undefined ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4">
                  <Skeleton className="aspect-square rounded-lg mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Browse our collection and click the heart icon to save items you love.
              </p>
              <Button asChild size="lg" className="px-8">
                <Link href="/jewelry">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  <span className="font-semibold text-black">{wishlistItems.length}</span> items saved
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item: any) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <Link href={`/product/${item.product._id}`}>
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link href={`/product/${item.product._id}`}>
                        <h3 className="font-semibold text-gray-900 mb-1 hover:text-amber-600 transition-colors line-clamp-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      <p className="text-lg font-bold text-gray-900 mb-4">
                        R{item.product.isForHire 
                          ? (item.product.hirePrice || 0).toFixed(2) + "/day"
                          : (item.product.price || 0).toFixed(2)
                        }
                      </p>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(item.product)}
                          className="flex-1"
                          size="sm"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemove(item.productId)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </SignedIn>
      </div>
    </div>
  );
}
