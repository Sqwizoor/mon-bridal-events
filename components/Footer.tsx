import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Heart,
  Gem,
  Calendar,
  Clock,
  ArrowRight
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container px-4 md:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold mb-2">Stay in the Loop</h3>
              <p className="text-gray-400">Subscribe for exclusive offers and new arrivals</p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block cursor-pointer">
              <h3 className="font-serif text-3xl font-bold tracking-wider">MON BRIDAL</h3>
              <p className="text-amber-400 text-sm tracking-widest">& EVENTS</p>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Your premier destination for exquisite jewelry and luxury event decor hire. 
              Making your special moments unforgettable since 2020.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Gem className="h-4 w-4 text-amber-400" />
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/jewelry" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  All Jewelry
                </Link>
              </li>
              <li>
                <Link href="/jewelry?type=rings" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/jewelry?type=necklaces" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/jewelry?type=earrings" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  All Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Decor Hire */}
          <div>
            <h4 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400" />
              Decor Hire
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/decor" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Browse All
                </Link>
              </li>
              <li>
                <Link href="/decor?type=candle_holders" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Candle Holders
                </Link>
              </li>
              <li>
                <Link href="/decor?type=vases" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Vases
                </Link>
              </li>
              <li>
                <Link href="/decor?type=table_linen" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Table Linen
                </Link>
              </li>
              <li>
                <Link href="/decor?type=furniture" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group cursor-pointer">
                  <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                  Furniture
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 Wedding Lane<br />
                  Johannesburg, South Africa
                </span>
              </li>
              <li>
                <a href="tel:+27123456789" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <Phone className="h-5 w-5 text-amber-400" />
                  <span className="text-sm">+27 12 345 6789</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@monbridal.co.za" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
                  <Mail className="h-5 w-5 text-amber-400" />
                  <span className="text-sm">hello@monbridal.co.za</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Mon - Fri: 9am - 6pm<br />
                  Sat: 9am - 2pm
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Mon Bridal and Events. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                Privacy
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                About
              </Link>
            </div>
            <p className="text-gray-600 text-sm flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> in South Africa
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
