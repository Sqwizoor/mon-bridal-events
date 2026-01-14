"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, Menu, LayoutDashboard, Gem, Calendar, ChevronDown, X, Heart, Home, Layers, Info, ArrowRight } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LiveSearch } from "@/components/LiveSearch";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const JEWELRY_CATEGORIES = [
  { name: "Rings", slug: "rings", icon: "💍" },
  { name: "Necklaces", slug: "necklaces", icon: "📿" },
  { name: "Earrings", slug: "earrings", icon: "✨" },
  { name: "Bracelets", slug: "bracelets", icon: "⭕" },
  { name: "Jewelry Sets", slug: "sets", icon: "👑" },
];

const DECOR_CATEGORIES = [
  { name: "Candle Holders", slug: "candle_holders", icon: "🕯️" },
  { name: "Vases", slug: "vases", icon: "🏺" },
  { name: "Table Linen", slug: "table_linen", icon: "🧵" },
  { name: "Glassware", slug: "glassware", icon: "🥂" },
  { name: "Furniture", slug: "furniture", icon: "🪑" },
];

export default function Navbar() {
  const router = useRouter();
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const convexUser = useQuery(api.users.current);
  const { user: clerkUser, isLoaded } = useUser();

  // Only check admin status when data is loaded
  const clerkRole = (clerkUser?.publicMetadata?.role as string) || (clerkUser?.unsafeMetadata?.role as string);
  
  const isAdmin = isLoaded && clerkUser && (
    convexUser?.role === "admin" || 
    clerkRole?.toLowerCase() === "admin"
  );
  
  // Debug logging - only when loaded
  if (isLoaded && clerkUser) {
    console.log("🔍 Navbar Admin Check:", {
      convexRole: convexUser?.role,
      clerkPublicMetadata: clerkUser?.publicMetadata,
      clerkUnsafeMetadata: clerkUser?.unsafeMetadata,
      clerkRole: clerkRole,
      isAdmin: isAdmin,
    });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/10 bg-white text-black backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        
        {/* LEFT SECTION: Mobile Logo & Desktop Links */}
        <div className="flex items-center justify-start md:justify-end md:pr-12 gap-2">
          {/* Mobile Logo */}
          <Link href="/" className="flex flex-col md:hidden">
            <Image 
              src="/mon-bridal.jpeg" 
              alt="MON Bridal" 
              width={160} 
              height={50} 
              className="w-auto h-12 object-contain rounded-full"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 text-sm font-medium tracking-wide">
            {/* Jewelry Dropdown */}
            <div className="relative group">
              <Link 
                href="/jewelry" 
                className="flex items-center gap-1 px-4 py-2 hover:text-amber-400 transition-colors uppercase cursor-pointer"
              >
                <Gem className="h-4 w-4" />
                Jewelry
                <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white/95 backdrop-blur-lg border border-black/10 rounded-xl p-4 min-w-[200px] shadow-2xl">
                  <Link href="/jewelry" className="block px-3 py-2 text-black hover:text-amber-600 transition-colors font-medium cursor-pointer">
                    All Jewelry
                  </Link>
                  <div className="h-px bg-black/10 my-2" />
                  {JEWELRY_CATEGORIES.map((cat) => (
                    <Link 
                      key={cat.slug}
                      href={`/jewelry?type=${cat.slug}`} 
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-black transition-colors cursor-pointer"
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Decor Dropdown */}
            <div className="relative group">
              <Link 
                href="/decor" 
                className="flex items-center gap-1 px-4 py-2 hover:text-amber-400 transition-colors uppercase cursor-pointer"
              >
                <Calendar className="h-4 w-4" />
                Decor
                <ChevronDown className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white/95 backdrop-blur-lg border border-black/10 rounded-xl p-4 min-w-[200px] shadow-2xl">
                  <Link href="/decor" className="block px-3 py-2 text-black hover:text-amber-600 transition-colors font-medium cursor-pointer">
                    All Decor
                  </Link>
                  <div className="h-px bg-black/10 my-2" />
                  {DECOR_CATEGORIES.map((cat) => (
                    <Link 
                      key={cat.slug}
                      href={`/decor?type=${cat.slug}`} 
                      className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-black transition-colors cursor-pointer"
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/categories" className="px-4 py-2 hover:text-amber-400 transition-colors uppercase cursor-pointer">
              Categories
            </Link>
          </div>
        </div>

        {/* CENTER SECTION: Desktop Logo */}
        <Link href="/" className="hidden md:flex flex-col items-center justify-center cursor-pointer">
          <Image 
            src="/mon-bridal.jpeg" 
            alt="MON Bridal" 
            width={240} 
            height={80} 
            className="w-auto h-20 object-contain rounded-full"
            priority
          />
        </Link>

        {/* RIGHT SECTION: Actions (Search, Cart, Auth, Mobile Menu) */}
        <div className="flex items-center justify-end gap-3">
          {/* Search Bar */}
          <LiveSearch />

          {/* Admin Dashboard Button (Desktop) */}
          {isAdmin && (
             <Button variant="ghost" size="icon" className="hidden md:flex text-amber-600 hover:text-amber-700 hover:bg-black/5 cursor-pointer" asChild title="Admin Dashboard">
               <Link href="/admin">
                 <LayoutDashboard className="h-5 w-5" />
               </Link>
             </Button>
          )}

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative text-black hover:bg-black/5 hover:text-black cursor-pointer" asChild>
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {/* User Auth */}
          <div className="flex items-center md:pl-2 md:border-l md:border-black/10 md:ml-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="hidden md:flex text-black hover:bg-black/5 hover:text-black cursor-pointer">
                  Sign In
                </Button>
              </SignInButton>
              {/* Mobile Sign In Icon */}
              <SignInButton mode="modal">
                <Button variant="ghost" size="icon" className="flex md:hidden text-black hover:bg-black/5 cursor-pointer">
                   <UserButton /> 
                   <span className="text-xs font-medium">Log In</span>
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 ring-2 ring-black/10 hover:ring-black/30 transition-all"
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Menu Trigger & Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-black hover:bg-black/5 hover:text-black cursor-pointer ml-1">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white text-black border-l-black/10 w-80 sm:w-[350px] overflow-y-auto">
              <div className="flex flex-col h-full py-6">
                <SheetClose asChild>
                  <Link href="/" className="mb-8 cursor-pointer self-start pl-4 inline-block">
                    <Image 
                      src="/mon-bridalevents-logo.png" 
                      alt="MON Bridal" 
                      width={140} 
                      height={50} 
                      className="w-auto h-10 object-contain"
                    />
                  </Link>
                </SheetClose>
                
                <nav className="flex-1 space-y-2">
                  <SheetClose asChild>
                    <Link href="/" className="flex items-center gap-4 text-lg font-medium hover:text-amber-400 transition-colors py-3 pl-4 border-b border-gray-100 cursor-pointer">
                      <Home className="h-5 w-5" />
                      Home
                    </Link>
                  </SheetClose>

                  {/* Jewelry Accordion */}
                  <details className="group border-b border-gray-100">
                    <summary className="flex items-center justify-between py-3 pl-4 pr-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <div className="flex items-center gap-4 text-lg font-medium group-open:text-amber-500 transition-colors">
                        <Gem className="h-5 w-5" />
                        Jewelry
                      </div>
                      <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-1 pb-3 pl-4 animate-in slide-in-from-top-2 duration-200">
                      <SheetClose asChild>
                        <Link href="/jewelry" className="flex items-center gap-3 py-2 text-gray-600 hover:text-black text-sm pl-4">
                          <ArrowRight className="h-4 w-4" />
                          View All Jewelry
                        </Link>
                      </SheetClose>
                      {JEWELRY_CATEGORIES.map((cat) => (
                        <SheetClose key={cat.slug} asChild>
                          <Link 
                            href={`/jewelry?type=${cat.slug}`} 
                            className="flex items-center gap-3 py-2 text-gray-600 hover:text-black text-sm pl-4"
                          >
                            <span className="text-lg">{cat.icon}</span> 
                            {cat.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </details>

                  {/* Decor Accordion */}
                  <details className="group border-b border-gray-100">
                    <summary className="flex items-center justify-between py-3 pl-4 pr-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                      <div className="flex items-center gap-4 text-lg font-medium group-open:text-amber-500 transition-colors">
                        <Calendar className="h-5 w-5" />
                        Decor Hire
                      </div>
                      <ChevronDown className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="space-y-1 pb-3 pl-4 animate-in slide-in-from-top-2 duration-200">
                      <SheetClose asChild>
                        <Link href="/decor" className="flex items-center gap-3 py-2 text-gray-600 hover:text-black text-sm pl-4">
                          <ArrowRight className="h-4 w-4" />
                          View All Decor
                        </Link>
                      </SheetClose>
                      {DECOR_CATEGORIES.map((cat) => (
                        <SheetClose key={cat.slug} asChild>
                          <Link 
                            href={`/decor?type=${cat.slug}`} 
                            className="flex items-center gap-3 py-2 text-gray-600 hover:text-black text-sm pl-4"
                          >
                             <span className="text-lg">{cat.icon}</span> 
                             {cat.name}
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </details>

                  <SheetClose asChild>
                    <Link href="/categories" className="flex items-center gap-4 text-lg font-medium hover:text-amber-400 transition-colors py-3 pl-4 border-b border-gray-100 cursor-pointer">
                      <Layers className="h-5 w-5" />
                      All Categories
                    </Link>
                  </SheetClose>
                  
                  <SheetClose asChild>
                    <Link href="/about" className="flex items-center gap-4 text-lg font-medium hover:text-amber-400 transition-colors py-3 pl-4 border-b border-gray-100 cursor-pointer">
                      <Info className="h-5 w-5" />
                      About Us
                    </Link>
                  </SheetClose>

                  {isAdmin && (
                    <SheetClose asChild>
                      <Link 
                        href="/admin" 
                        className="flex items-center gap-4 py-3 pl-4 text-lg font-medium text-amber-600 hover:text-amber-500 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Admin Dashboard
                      </Link>
                    </SheetClose>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
