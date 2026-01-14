import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Heart, 
  Sparkles, 
  Users, 
  Award, 
  Truck, 
  Clock,
  ArrowRight,
  Quote
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-2xl">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-6">
              Our Story
            </Badge>
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Creating Unforgettable 
              <span className="text-amber-400"> Moments</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              South Africa's premier destination for luxury jewelry and event decor hire. 
              Making your special occasions truly extraordinary since 2020.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge variant="outline">Who We Are</Badge>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                Elegance Meets Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Welcome to Mon Bridal & Events, where every piece tells a story and every event 
                  becomes a cherished memory. Founded with a passion for elegance and celebration, 
                  we've dedicated ourselves to making special occasions truly unforgettable.
                </p>
                <p>
                  Our curated collection of fine jewelry offers timeless pieces perfect for weddings, 
                  engagements, anniversaries, and meaningful gifts. Each piece is carefully selected 
                  for its craftsmanship, beauty, and ability to capture life's precious moments.
                </p>
                <p>
                  Our decor hiring service transforms ordinary venues into extraordinary spaces. 
                  From intimate gatherings to grand celebrations, we provide premium furniture, 
                  table settings, and decorative elements that bring your vision to life.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"
                  alt="Elegant event setup"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-amber-400 text-black p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-bold">5+</div>
                <div className="text-sm font-medium">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Our Values</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              What Sets Us Apart
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Passion</h3>
              <p className="text-muted-foreground text-sm">
                Every piece we offer and every event we support is infused with our love for beauty and celebration.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Quality</h3>
              <p className="text-muted-foreground text-sm">
                We never compromise on quality. Every item in our collection meets the highest standards.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Service</h3>
              <p className="text-muted-foreground text-sm">
                Your satisfaction is our priority. We go above and beyond to make your experience exceptional.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Elegance</h3>
              <p className="text-muted-foreground text-sm">
                Sophistication in every detail. We believe beauty lies in the careful attention to elegance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black text-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">500+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">200+</div>
              <div className="text-gray-400">Events Styled</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">1000+</div>
              <div className="text-gray-400">Products Available</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">5★</div>
              <div className="text-gray-400">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-12 w-12 text-amber-400 mx-auto mb-6" />
            <blockquote className="font-serif text-2xl md:text-3xl text-gray-800 mb-8 leading-relaxed">
              "Mon Bridal made our wedding absolutely magical. The jewelry was stunning and 
              the decor transformed our venue into a fairytale setting. Couldn't recommend them more!"
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="text-left">
                <div className="font-semibold">Sarah & Michael</div>
                <div className="text-sm text-muted-foreground">Wedding - December 2024</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="bg-black text-white rounded-3xl p-12 md:p-16 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Ready to Create Your Perfect Moment?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Whether you're planning a wedding, corporate event, or special celebration, 
              we're here to make it extraordinary.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100" asChild>
                <Link href="/jewelry">
                  Shop Jewelry
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
