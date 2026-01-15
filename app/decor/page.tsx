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
} from "lucide-react";

const DECOR_CATEGORIES = [
  { value: "all", label: "All Decor", icon: "💎", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400" },
  { value: "candle_holders", label: "Candle Holders", icon: "🕯️", image: "https://images.unsplash.com/photo-1620857316335-9f5b404d55b8?auto=format&fit=crop&q=80&w=400" },
  { value: "vases", label: "Vases", icon: "🏺", image: "https://images.unsplash.com/photo-1582236873550-983196f7c469?auto=format&fit=crop&q=80&w=400" },
  { value: "table_linen", label: "Table Linen", icon: "🧵", image: "https://images.unsplash.com/photo-1481018085669-2bc6e4f00eed?auto=format&fit=crop&q=80&w=400" },
  { value: "underplates", label: "Underplates", icon: "🍽️", image: "https://images.unsplash.com/photo-1627917887719-72f883652c71?auto=format&fit=crop&q=80&w=400" },
  { value: "crockery", label: "Crockery", icon: "🫖", image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80&w=400" },
  { value: "cutlery", label: "Cutlery", icon: "🍴", image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&q=80&w=400" },
  { value: "glassware", label: "Glassware", icon: "🥂", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400" },
  { value: "cake_stands", label: "Cake Stands", icon: "🎂", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400" },
  { value: "lanterns", label: "Lanterns", icon: "🏮", image: "https://images.unsplash.com/photo-1513267764121-69b5a2d10e32?auto=format&fit=crop&q=80&w=400" },
  { value: "furniture", label: "Furniture", icon: "🪑", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400" },
  { value: "easels", label: "Easels", icon: "🖼️", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400" },
  { value: "candy_jars", label: "Candy Jars", icon: "🍬", image: "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?auto=format&fit=crop&q=80&w=400" },
  { value: "chalkboards", label: "Chalkboards", icon: "📝", image: "https://images.unsplash.com/photo-1550953110-38437f8f9c2d?auto=format&fit=crop&q=80&w=400" },
  { value: "gift_holders", label: "Gift Holders", icon: "🎁", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400" },
  { value: "lawn_games", label: "Lawn Games", icon: "🎯", image: "https://images.unsplash.com/photo-1611080356770-98b4c05b1c55?auto=format&fit=crop&q=80&w=400" },
  { value: "pots_buckets", label: "Pots & Buckets", icon: "🪴", image: "https://images.unsplash.com/photo-1463936575229-469959cb6d57?auto=format&fit=crop&q=80&w=400" },
  { value: "table_decor", label: "Table Decor", icon: "✨", image: "https://images.unsplash.com/photo-1530018352490-64e228d7d80a?auto=format&fit=crop&q=80&w=400" },
  { value: "miscellaneous", label: "Miscellaneous", icon: "📦", image: "https://images.unsplash.com/photo-1498955472675-532cba97cc18?auto=format&fit=crop&q=80&w=400" },
];

export default function DecorPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [gridCols, setGridCols] = useState(4);

  const products = useQuery(api.products.get, {
    category: "decor",
    isActive: true,
    decorType: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  // Filter and sort products
  const filteredProducts = products
    ?.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  const selectedCategoryInfo = DECOR_CATEGORIES.find(
    (c) => c.value === selectedCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-4 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="container mx-auto relative z-10 px-4 md:px-6">
          <div className="max-w-2xl">
            <Badge className="bg-white/10 text-amber-100 border-amber-200/20 mb-6 px-4 py-1.5 font-serif tracking-widest uppercase">
              Decor Hire
            </Badge>
            <h1 className="font-script text-6xl md:text-8xl text-white mb-4 leading-none">
              Event Decor
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Transform your venue with our premium decor collection. From elegant candle holders 
              to stunning table settings, we have everything you need to create unforgettable moments.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {products?.length || 0} items available
              </span>
              <span>•</span>
              <span>Free quotes</span>
              <span>•</span>
              <span>Delivery available</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Category Cards - Marquee */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Browse Categories
          </h2>
          <div className="relative -mx-4 md:mx-0">
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-12 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
            
            <Marquee pauseOnHover reverse className="[--duration:60s] py-4">
              {DECOR_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`group relative w-[160px] h-[110px] mx-2 overflow-hidden rounded-xl transition-all duration-300 hover:shadow-lg flex-shrink-0 ${
                    selectedCategory === category.value
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img 
                      src={category.image} 
                      alt={category.label}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/50 ${
                      selectedCategory === category.value ? "bg-black/60" : ""
                    }`} />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2">
                    <span className="text-xl mb-1 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                      {category.icon}
                    </span>
                    <span className="text-xs font-semibold text-center leading-tight tracking-wide uppercase">
                      {category.label}
                    </span>
                  </div>
                </button>
              ))}
            </Marquee>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm border">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search decor items..."
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
          <div className="flex gap-2">
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
        {(selectedCategory !== "all" || searchQuery) && (
          <div className="flex items-center gap-2 mb-6">
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
            {selectedCategory !== "all" ? selectedCategoryInfo?.label.toLowerCase() : "decor"} items
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
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-4 md:gap-6`}>
            {filteredProducts?.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* How It Works Section */}
        <section className="mt-20 py-12 px-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">
            How Decor Hiring Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="font-semibold mb-2">Browse & Select</h3>
              <p className="text-sm text-muted-foreground">
                Browse our collection and add items to your quote. Mix and match to create your perfect setup.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="font-semibold mb-2">Get Your Quote</h3>
              <p className="text-sm text-muted-foreground">
                Submit your request with your event date and we'll check availability and send you a detailed quote.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="font-semibold mb-2">Confirm & Enjoy</h3>
              <p className="text-sm text-muted-foreground">
                Pay your deposit to confirm. We'll deliver and collect, so you can focus on your special day.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
