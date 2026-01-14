"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero-deco.jpg"
          alt="Elegant bridal and events"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
      </div>

     

      {/* Hero Content - Centered */}
      <div className="relative md:mt-[-2rem] z-10 flex h-full md:min-h-[calc(100vh-88px-60px)] flex-col items-center justify-center px-6 text-center md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm text-white backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
          Refined Jewelry & Event Décor Rentals
          </div>

          {/* Main Headline */}
          <h1 className="font-script text-4xl md:text-6xl lg:text-6xl leading-[1.05] tracking-tight text-amber-100/90 md:text-7xl lg:text-8xl">
           Luxury Jewelry &  Event 
            <br />
            <span className="font-script font-normal text-4xl md:text-6xl lg:text-6xl text-amber-100/90 block mt-2">Décor Available For Rent</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            We are passionate about supplying our clients with high-quality service and  products.
           
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button asChild size="lg" className="group bg-white px-8 text-foreground hover:bg-white/90">
              <Link href="/decor">
                Explore Event Rentals
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent px-8 text-white hover:bg-white/10"
            >
              <Link href="/jewelry">Shop Jewelry</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 overflow-hidden border-t border-white/10 bg-black/40 py-4 backdrop-blur-sm">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-8 font-serif text-sm uppercase tracking-[0.25em] text-white/80">Event Rentals</span>
              <span className="text-amber-400">✦</span>
              <span className="mx-8 font-serif text-sm uppercase tracking-[0.25em] text-white/80">Bridal Jewelry</span>
              <span className="text-amber-400">✦</span>
              <span className="mx-8 font-serif text-sm uppercase tracking-[0.25em] text-white/80">Table Decor</span>
              <span className="text-amber-400">✦</span>
              <span className="mx-8 font-serif text-sm uppercase tracking-[0.25em] text-white/80">
                Luxury Accessories
              </span>
              <span className="text-amber-400">✦</span>
              <span className="mx-8 font-serif text-sm uppercase tracking-[0.25em] text-white/80">Dream Events</span>
              <span className="text-amber-400">✦</span>
              <span className="mx-8 font-serif text-sm uppercase tracking-[0.25em] text-white/80">Fine Jewelry</span>
              <span className="text-amber-400">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
