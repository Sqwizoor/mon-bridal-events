"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-linear-to-b from-white to-gray-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Animated 404 */}
          <div className="relative">
            <h1 className="text-[150px] md:text-[200px] font-serif font-bold text-gray-100 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-linear-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">
                <Sparkles className="h-16 w-16 text-amber-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4 max-w-md -mt-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg">
              Oops! The page you're looking for seems to have wandered off. 
              Perhaps it's out shopping for jewelry or picking out decor?
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="bg-black hover:bg-gray-800">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/jewelry">
                <Sparkles className="mr-2 h-5 w-5" />
                Browse Jewelry
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t w-full max-w-lg">
            <p className="text-sm text-muted-foreground mb-4">Popular destinations:</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link 
                href="/jewelry" 
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                💍 Jewelry
              </Link>
              <Link 
                href="/decor" 
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                🎨 Decor Hire
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                ℹ️ About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
