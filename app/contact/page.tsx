"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Instagram,
  Facebook,
  MessageCircle
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ContactPage() {
  const createInquiry = useMutation(api.inquiries.create);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    venue: "",
    guestCount: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        venue: formData.venue || undefined,
        guestCount: formData.guestCount ? parseInt(formData.guestCount) : undefined,
        message: formData.message,
        subject: `Booking Request: ${formData.eventType || "Event"}`,
      });

      toast.success("Inquiry sent successfully! We'll be in touch shortly to confirm availability.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventType: "",
        eventDate: "",
        venue: "",
        guestCount: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Hero Section */}
      <section className="bg-neutral-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2070')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <Badge className="bg-white/10 hover:bg-white/20 text-white mb-6 backdrop-blur-sm border-white/20 px-4 py-1.5 text-sm uppercase tracking-wider">
            Book Your Date
          </Badge>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Let's Plan Your Event
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
            From intimate weddings to grand corporate celebrations, tell us about your vision. 
            Fill out the form below to check availability and start the planning process.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-16 -mt-10 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Info Side */}
          <div className="order-2 lg:order-1 space-y-8 lg:pt-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100">
              <h2 className="font-serif text-2xl font-bold mb-6">
                Get in Touch
              </h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-100 transition-colors">
                    <MapPin className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Our Studio</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      123 Wedding Lane<br />
                      Sandton, Johannesburg<br />
                      South Africa, 2196
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-100 transition-colors">
                    <Phone className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-muted-foreground text-sm space-y-1">
                      <a href="tel:+27123456789" className="block hover:text-black transition-colors">+27 12 345 6789</a>
                      <a href="tel:+27123456780" className="block hover:text-black transition-colors">+27 12 345 6780</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-100 transition-colors">
                    <Mail className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground text-sm space-y-1">
                      <a href="mailto:hello@monbridal.co.za" className="block hover:text-black transition-colors">hello@monbridal.co.za</a>
                      <a href="mailto:bookings@monbridal.co.za" className="block hover:text-black transition-colors">bookings@monbridal.co.za</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-100 transition-colors">
                    <Clock className="h-5 w-5 text-neutral-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Office Hours</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Mon - Fri: 9am - 5pm<br />
                      Sat: 9am - 1pm<br />
                      Sun: By Appointment
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-neutral-100">
                <div className="flex gap-4">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a 
                    href="https://wa.me/27123456789" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 border rounded-full flex items-center justify-center hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all duration-300"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form - Main Focus */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl shadow-neutral-100/50 border border-neutral-100">
              <div className="mb-10">
                <h2 className="font-serif text-3xl font-bold mb-3">
                  Booking Inquiry
                </h2>
                <p className="text-muted-foreground">
                  Please fill in the details below. We'll check our availability and get back to you with a custom quote.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Jane Doe"
                      className="bg-neutral-50 border-transparent focus:bg-white focus:border-neutral-200 transition-all h-12"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@example.com"
                      className="bg-neutral-50 border-transparent focus:bg-white focus:border-neutral-200 transition-all h-12"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+27 ..."
                      className="bg-neutral-50 border-transparent focus:bg-white focus:border-neutral-200 transition-all h-12"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventType" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Event Type *</Label>
                    <Select 
                      value={formData.eventType} 
                      onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                    >
                      <SelectTrigger className="bg-neutral-50 border-transparent focus:bg-white focus:border-neutral-200 transition-all h-12">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="proposal">Proposal Setup</SelectItem>
                        <SelectItem value="birthday">Birthday Party</SelectItem>
                        <SelectItem value="baby_shower">Baby Shower</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="photoshoot">Photo Shoot</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                   <div className="space-y-2">
                    <Label htmlFor="eventDate" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Event Date *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      className="bg-neutral-50 border-transparent focus:bg-white focus:border-neutral-200 transition-all h-12"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestCount" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Guest Count</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      placeholder="e.g. 50"
                      className="bg-neutral-50 border-transparent focus:bg-white focus:border-neutral-200 transition-all h-12"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="venue" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Venue Location</Label>
                    <Input
                      id="venue"
                      placeholder="City or Venue Name"
                      className="bg-neutral-50 border-transparent focus:bg-white focus:border-neutral-200 transition-all h-12"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Additional Details</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your vision, color themes, or specific requirements..."
                    rows={6}
                    className="bg-neutral-50 border-transparent focus:bg-white focus:border-neutral-200 transition-all resize-none p-4"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white h-14 text-base tracking-wide transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing Request...</>
                    ) : (
                      <>
                        Submit Booking Request
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <div className="bg-neutral-100 rounded-2xl h-[400px] flex items-center justify-center grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-26.107567,28.056702&zoom=14&size=800x400&style=feature:all|element:all|saturation:-100&key=YOUR_API_KEY')] bg-cover bg-center" />
             <div className="text-center text-muted-foreground relative z-10 bg-white/80 backdrop-blur-sm p-6 rounded-xl border shadow-sm">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-neutral-800" />
              <p className="font-semibold text-neutral-900">Visit Our Studio</p>
              <p className="text-xs">Sandton, Johannesburg</p>
            </div>
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="mt-20 border-t pt-20">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Common Questions
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to know about booking with us.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-3">How do bookings work?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Submit an inquiry form with your event details. We'll check availability and send you a custom quote within 24 hours. A 50% deposit secures your date.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-3">Do you travel?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are based in Gauteng but love to travel! Travel fees are calculated based on the distance from our studio to your venue.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-3">Can we view items?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Absolutely. We offer consultation appointments at our studio where you can see our decor collection and mockups in person.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
