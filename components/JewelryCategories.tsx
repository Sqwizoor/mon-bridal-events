"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const categories = [
  { 
    name: "Rings", 
    slug: "rings", 
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Necklaces", 
    slug: "necklaces", 
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Earrings", 
    slug: "earrings", 
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Bracelets", 
    slug: "bracelets", 
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Bridal Sets", 
    slug: "sets", 
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Hair Acc.", 
    slug: "hair_accessories", 
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=400&auto=format&fit=crop" 
  },
  { 
    name: "Anklets", 
    slug: "anklets", 
    image: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=400&auto=format&fit=crop" 
  },
];

export default function JewelryCategories() {
  return (
    <section className="pt-10 pb-4 border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900">
              Explore Collections
            </h2>
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
        
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              href={`/jewelry?type=${cat.slug}`}
              className="group flex flex-col items-center gap-3 min-w-20 snap-start"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 bg-linear-to-tr from-amber-200 via-yellow-400 to-amber-600 bg-size-[400%_400%] animate-gradient-xy group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white relative bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
              <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
