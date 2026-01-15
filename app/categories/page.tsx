"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Gem, Palette, ArrowRight, Sparkles } from "lucide-react";

const DECOR_CATEGORIES = [
  { slug: "candle_holders", name: "Candle Holders", icon: "🕯️", image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400" },
  { slug: "vases", name: "Vases", icon: "🏺", image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400" },
  { slug: "table_linen", name: "Table Linen", icon: "🧵", image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400" },
  { slug: "underplates", name: "Underplates", icon: "🍽️", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
  { slug: "crockery", name: "Crockery & Serveware", icon: "🫖", image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400" },
  { slug: "cutlery", name: "Cutlery", icon: "🍴", image: "https://images.unsplash.com/photo-1530991472021-ce0e43475f6e?w=400" },
  { slug: "glassware", name: "Coloured Glassware", icon: "🥂", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400" },
  { slug: "cake_stands", name: "Cake Stands", icon: "🎂", image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400" },
  { slug: "lanterns", name: "Lanterns", icon: "🏮", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400" },
  { slug: "furniture", name: "Furniture", icon: "🪑", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" },
  { slug: "easels", name: "Easels", icon: "🖼️", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400" },
  { slug: "chalkboards", name: "Chalkboards", icon: "📝", image: "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=400" },
];

const JEWELRY_CATEGORIES = [
  { slug: "rings", name: "Rings", icon: "💍", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400" },
  { slug: "necklaces", name: "Necklaces", icon: "📿", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400" },
  { slug: "earrings", name: "Earrings", icon: "✨", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400" },
  { slug: "bracelets", name: "Bracelets", icon: "⭕", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400" },
  { slug: "brooches", name: "Brooches", icon: "🌸", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400" },
  { slug: "sets", name: "Jewelry Sets", icon: "👑", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400" },
  { slug: "hair_accessories", name: "Hair Accessories", icon: "🎀", image: "https://images.unsplash.com/photo-1625794084867-8ddd239946b1?w=400" },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      {/* Hero */}
      <section className="bg-black text-white py-16">
        <div className="container px-4 md:px-6 text-center">
          <Badge className="bg-white/20 text-white mb-4">Browse Collection</Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Shop by Category
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Explore our curated collections of fine jewelry and premium event decor
          </p>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-16 space-y-20">
        {/* Jewelry Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Gem className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Jewelry Collection</h2>
              <p className="text-muted-foreground">Exquisite pieces for every occasion</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {JEWELRY_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/jewelry?type=${category.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <span className="text-2xl md:text-3xl mb-1">{category.icon}</span>
                  <h3 className="font-semibold text-white text-sm md:text-base">{category.name}</h3>
                  <div className="flex items-center text-white/70 text-xs mt-1 group-hover:text-white transition-colors">
                    <span>Shop Now</span>
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Decor Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold">Decor Hire</h2>
              <p className="text-muted-foreground">Transform your event venue</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {DECOR_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/decor?type=${category.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                  <span className="text-2xl md:text-3xl mb-1">{category.icon}</span>
                  <h3 className="font-semibold text-white text-sm md:text-base">{category.name}</h3>
                  <div className="flex items-center text-white/70 text-xs mt-1 group-hover:text-white transition-colors">
                    <span>Browse</span>
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-linear-to-r from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12 text-center">
          <Sparkles className="h-10 w-10 text-amber-500 mx-auto mb-4" />
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Contact us and we'll help you find the perfect pieces for your special occasion
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Get in Touch
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </section>
      </div>
    </div>
  );
}
