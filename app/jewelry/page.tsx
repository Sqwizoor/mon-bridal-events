"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Marquee from "@/components/ui/marquee";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  X,
  Gem,
  Sparkles,
} from "lucide-react";

const JEWELRY_CATEGORIES = [
  { value: "all", label: "All Jewelry", icon: "💎" },
  { value: "rings", label: "Rings", icon: "💍" },
  { value: "necklaces", label: "Necklaces", icon: "📿" },
  { value: "earrings", label: "Earrings", icon: "✨" },
  { value: "bracelets", label: "Bracelets", icon: "⭕" },
  { value: "brooches", label: "Brooches", icon: "🌸" },
  { value: "sets", label: "Jewelry Sets", icon: "👑" },
  { value: "anklets", label: "Anklets", icon: "🦶" },
 

];

const PRICE_RANGES = [
  { value: "all", label: "All Prices" },
  { value: "0-500", label: "Under R500" },
  { value: "500-1000", label: "R500 - R1,000" },
  { value: "1000-2500", label: "R1,000 - R2,500" },
  { value: "2500-5000", label: "R2,500 - R5,000" },
  { value: "5000+", label: "R5,000+" },
];

export default function JewelryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [gridCols, setGridCols] = useState(4);
  const [visibleCount, setVisibleCount] = useState(12);

  const products = useQuery(api.products.get, {
    category: "jewelry",
    isActive: true,
    jewelryType: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  // Filter by price range
  const filterByPrice = (product: any) => {
    if (priceRange === "all") return true;
    const price = product.price;
    switch (priceRange) {
      case "0-500":
        return price < 500;
      case "500-1000":
        return price >= 500 && price < 1000;
      case "1000-2500":
        return price >= 1000 && price < 2500;
      case "2500-5000":
        return price >= 2500 && price < 5000;
      case "5000+":
        return price >= 5000;
      default:
        return true;
    }
  };

  // Filter and sort products
  const filteredProducts = products
    ?.filter((product) =>
      (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      filterByPrice(product)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return b.createdAt - a.createdAt;
      }
    });

  const selectedCategoryInfo = JEWELRY_CATEGORIES.find(
    (c) => c.value === selectedCategory
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-4 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 to-black/40" />
        <div className="container mx-auto relative z-10 px-4 md:px-6">
          <div className="max-w-2xl">
            <Badge className="bg-white/10 text-amber-100 border-amber-200/20 mb-6 px-4 py-1.5 font-serif tracking-widest uppercase">
              <Gem className="h-3 w-3 mr-2" />
              Jewelry Collection
            </Badge>
            <h1 className="font-script text-6xl md:text-8xl text-white mb-4 leading-none">
              Exquisite Jewelry
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Discover our curated collection of fine jewelry. From timeless classics to 
              contemporary designs, find the perfect piece for your special moments.
            </p>
            
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Category Pills */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Shop by Category
          </h2>
          {/* Mobile View: Marquee */}
          <div className="md:hidden -mx-4">
            <Marquee pauseOnHover reverse className="[--duration:30s] py-2">
              {JEWELRY_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 md:px-4 md:py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 md:flex-shrink snap-start ${
                  selectedCategory === category.value
                    ? "bg-black text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
            </Marquee>
          </div>
          {/* Desktop View: Static Grid */}
          <div className="hidden md:flex overflow-x-auto gap-3 pb-4 md:pb-0 md:flex-wrap md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 scrollbar-none snap-x">
            {JEWELRY_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 md:px-4 md:py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 md:flex-shrink snap-start ${
                  selectedCategory === category.value
                    ? "bg-black text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jewelry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden md:flex border rounded-lg">
              <Button
                variant={gridCols === 3 ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setGridCols(3)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridCols === 4 ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setGridCols(4)}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "all" || searchQuery || priceRange !== "all") && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCategory !== "all" && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => setSelectedCategory("all")}
              >
                {selectedCategoryInfo?.icon} {selectedCategoryInfo?.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {priceRange !== "all" && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => setPriceRange("all")}
              >
                {PRICE_RANGES.find((r) => r.value === priceRange)?.label}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            {searchQuery && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => setSearchQuery("")}
              >
                "{searchQuery}"
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setPriceRange("all");
              }}
              className="text-sm text-muted-foreground hover:text-foreground underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredProducts?.length || 0}
            </span>{" "}
            {selectedCategory !== "all" ? selectedCategoryInfo?.label.toLowerCase() : "jewelry"} pieces
          </p>
        </div>

        {/* Products Grid */}
        {products === undefined ? (
          <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-6`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts?.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-2">No jewelry found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setPriceRange("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-4 md:gap-6`}>
              {filteredProducts?.slice(0, visibleCount).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            
            {filteredProducts && filteredProducts.length > visibleCount && (
              <div className="mt-12 flex justify-center">
                <Button 
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  variant="outline"
                  className="px-8 min-w-[200px]"
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}

    
      </div>
    </div>
  );
}
