"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/ui/marquee";
import JewelryCategories from "@/components/JewelryCategories";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowRight,
  Sparkles,
  Gem,
  CalendarDays,
  Truck,
  Shield,
  HeartHandshake,
  Star,
} from "lucide-react";
import { HeroSection } from "@/components/Hero";

export default function Home() {
  const { results: featuredProducts, status, loadMore } = usePaginatedQuery(
    api.products.getFeaturedPaginated,
    {},
    { initialNumItems: 8 }
  );
  const newJewelry = useQuery(api.products.get, {
    category: "jewelry",
    isActive: true,
    limit: 4,
  });
  const popularDecor = useQuery(api.products.get, {
    category: "decor",
    isActive: true,
    limit: 4,
  });

  return (
    <div className="flex flex-col">
      <HeroSection/>
      {/* Jewelry Categories */}
      <JewelryCategories />

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="pt-10 pb-10 md:pb-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  Featured Collection
                </Badge>
                <h2 className="font-serif text-3xl md:text-4xl font-bold">
                  Curated For You
                </h2>
                <p className="text-muted-foreground mt-2 max-w-lg">
                  Hand-picked pieces that define elegance and style
                </p>
              </div>
              <Link href="/jewelry" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center md:hidden self-end">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              <Button variant="outline" asChild className="hidden md:inline-flex">
                <Link href="/jewelry">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {/* Mobile Marquee View */}
            <div className="md:hidden flex flex-col gap-6">
              <Marquee pauseOnHover className="[--duration:30s]">
                {featuredProducts.slice(0, Math.ceil(featuredProducts.length / 2)).map((product: any) => (
                  <div key={product._id} className="w-[170px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover className="[--duration:30s]">
                {featuredProducts.slice(Math.ceil(featuredProducts.length / 2)).map((product: any) => (
                  <div key={product._id} className="w-[170px]">
                    <ProductCard product={product} />
                  </div>
                ))}
              </Marquee>
            </div>

            {/* Desktop Grid View */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center w-full">
              {status === "CanLoadMore" && (
                <Button 
                  onClick={() => loadMore(8)} 
                  variant="outline"
                  size="lg"
                  className="px-8 min-w-[200px]"
                >
                  Load More Products
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="py-10 md:py-20 container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Whether you're looking to buy stunning jewelry or hire premium decor for your event
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Jewelry Card */}
          <Link href="/jewelry" className="group relative overflow-hidden rounded-2xl aspect-[2/1] bg-muted block">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <Badge className="w-fit mb-4 bg-white/20 text-white border-0">
                <Gem className="h-3 w-3 mr-1" />
                Jewelry
              </Badge>
              <h3 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Exquisite Jewelry
              </h3>
              <p className="text-gray-300 mb-4 max-w-sm">
                Rings, necklaces, earrings, and more. Find the perfect piece for your special day.
              </p>
              <div className="flex items-center text-sm font-medium group-hover:translate-x-2 transition-transform">
                Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Decor Card */}
          <Link href="/decor" className="group relative overflow-hidden rounded-2xl aspect-[2/1] bg-muted block">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <Badge className="w-fit mb-4 bg-white/20 text-white border-0">
                <CalendarDays className="h-3 w-3 mr-1" />
                Decor Hire
              </Badge>
              <h3 className="font-serif text-3xl md:text-4xl font-bold mb-2">
                Event Decor Hiring
              </h3>
              <p className="text-gray-300 mb-4 max-w-sm">
                Candle holders, vases, table settings, and more. Transform your venue.
              </p>
              <div className="flex items-center text-sm font-medium group-hover:translate-x-2 transition-transform">
                Browse Decor <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Side */}
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
                <span className="text-stone-600 block mt-2 text-2xl">MON CLOTHING & JEWELLERY</span>
              </h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  MON was born from the boundless creativity and curiosity of a young girl who found joy in crafting necklaces and earrings from beads. What began as a simple childhood passion has blossomed into a celebration of elegance and legacy.
                </p>
                <p>
                  The name MON, meaning "Mother of Nations" or "Mère de la Nation," embodies the spirit of a woman who is both graceful and profound. She is a beacon of purity and vision, dedicated to leaving a lasting legacy for future generations and she does so in style.
                </p>
                <p>
                  At MON, we create jewellery for women who cherish both style and substance, knowing that their inner sparkle adds brilliance to any piece they wear.
                </p>
              </div>
              <Button variant="outline" className="border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-colors" asChild>
                <Link href="/about">
                  Read Our Story
                </Link>
              </Button>
            </div>

            {/* Image Side */}
            <div className="relative h-[400px] w-[300px] mx-auto overflow-hidden rounded-2xl shadow-xl">
              <img 
                src="/owner-image.jpg" 
                alt="Founder of MON Bridal and Events" 
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Jewelry */}
      {newJewelry && newJewelry.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <Badge variant="outline" className="mb-4 border-amber-200 bg-amber-50 text-amber-700">
                  <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
                  New Arrivals
                </Badge>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
                  Latest Jewelry
                </h2>
                <p className="text-muted-foreground mt-2">
                  Fresh additions to our collection
                </p>
              </div>
              <Link href="/jewelry" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center md:hidden self-end">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              <Button variant="outline" className="hidden md:inline-flex hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200" asChild>
                <Link href="/jewelry">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {newJewelry.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works - Decor Hire */}
      <section className="py-24 bg-gradient-to-br from-amber-50/50 to-orange-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="bg-white/50 backdrop-blur-sm border-amber-200 text-amber-800">
              Simple Process
            </Badge>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900">
              Your Dream Event, Simplified
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're here to make your event setup effortless. Follow these three simple steps to bring your vision to life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-amber-100/50 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <span className="font-serif text-2xl font-bold text-amber-700">1</span>
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-gray-900">
                  Welcome & Explore
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to our website! We're dedicated to making your event setup simple and efficient. Start by browsing our curative menu of items designed to inspire.
                </p>
              </div>
              {/* Arrow 1 */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-amber-300">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-amber-100/50 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <span className="font-serif text-2xl font-bold text-amber-700">2</span>
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-gray-900">
                  Build Your Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simply select your items and add them to your cart to build your dream event. We'll quickly check availability for your date and return a detailed quote.
                </p>
              </div>
              {/* Arrow 2 */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 text-amber-300">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-amber-100/50 h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <span className="font-serif text-2xl font-bold text-amber-700">3</span>
                </div>
                <h3 className="font-serif text-xl font-bold mb-3 text-gray-900">
                  Personalize & Connect
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Add any questions or specific needs in your cart's comment section so we can cater exactly to you. Need a mock-up? Just email or call us to book an appointment.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button size="lg" className="rounded-full px-8 bg-black text-white hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl" asChild>
              <Link href="/decor">
                Start Building Your Event <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Decor */}
      {popularDecor && popularDecor.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <div>
                <Badge variant="outline" className="mb-4">Popular Items</Badge>
                <h2 className="font-serif text-3xl md:text-4xl font-bold">
                  Trending Decor
                </h2>
                <p className="text-muted-foreground mt-2">
                  Most requested items for events
                </p>
              </div>
              <Link href="/decor" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center md:hidden self-end">
                View All Decor <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              <Button variant="outline" asChild className="hidden md:inline-flex">
                <Link href="/decor">
                  View All Decor <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {popularDecor.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Badges */}
      <section className="py-16 bg-gray-50 border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Fast Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Nationwide shipping available
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                100% protected transactions
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                <HeartHandshake className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Quality Promise</h3>
              <p className="text-sm text-muted-foreground">
                Premium products guaranteed
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">5-Star Service</h3>
              <p className="text-sm text-muted-foreground">
                Exceptional customer care
              </p>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
