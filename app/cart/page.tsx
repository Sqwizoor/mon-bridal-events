"use client";

import { useCart } from "@/lib/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const { items, removeFromCart, total: baseTotal, clearCart, isLoading } = useCart();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Rental Dates
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const hasHiringItems = items.some(item => item.isForHire);

  const calculateRentalDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return days > 0 ? days : 1;
  };

  const rentalDays = hasHiringItems ? calculateRentalDays() : 1;

  const effectiveTotal = items.reduce((sum, item) => {
    let itemTotal = item.price * item.quantity;
    if (item.isForHire) {
      itemTotal *= rentalDays;
    }
    return sum + itemTotal;
  }, 0);

  const createOrder = useMutation(api.orders.create);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    
    // Address
    street: "",
    city: "",
    province: "",
    postalCode: "",
    country: "South Africa",
    
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderItems = items.map(item => ({
        productId: item.id as Id<"products">,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        // Default values for optional fields not yet in cart context
        color: undefined,
        size: undefined, 
        imageStorageId: undefined 
      }));

      await createOrder({
        items: orderItems,
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: formData.country
        },
        notes: formData.notes,
        rentalStartDate: startDate ? new Date(startDate).getTime() : undefined,
        rentalEndDate: endDate ? new Date(endDate).getTime() : undefined,
      });

      toast.success("Order submitted successfully! We will contact you soon.");
      clearCart();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
             {[1, 2, 3].map((i) => (
               <Skeleton key={i} className="h-32 w-full rounded-lg" />
             ))}
          </div>
          <div className="space-y-6">
             <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 text-center space-y-4">
        <h1 className="text-3xl font-serif font-bold">Your Cart is Empty</h1>
        <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
        <Button asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      img
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-lg leading-tight">{item.name}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                     R{item.price.toFixed(2)} x {item.quantity}
                     {item.isForHire && (
                        <span className="block text-xs font-semibold text-purple-600">
                           {rentalDays} Day Rental ({rentalDays} x per day fee)
                        </span>
                     )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="font-bold text-lg">
                  R{(item.price * item.quantity * (item.isForHire ? rentalDays : 1)).toFixed(2)}
                </p>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-xl bg-muted/30 space-y-4 sticky top-24">
            <h3 className="font-serif font-bold text-xl">Order Summary</h3>
            
            {hasHiringItems && (
              <div className="p-4 bg-white/50 rounded-lg border border-purple-100 space-y-3">
                <h4 className="font-medium text-sm text-purple-900 flex items-center gap-2">
                   <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                   Rental Period
                </h4>
                <div className="grid grid-cols-2 gap-2">
                   <div className="space-y-1">
                      <Label className="text-xs">Start Date</Label>
                      <Input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        className="h-8 text-xs bg-white"
                      />
                   </div>
                   <div className="space-y-1">
                      <Label className="text-xs">End Date</Label>
                      <Input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        className="h-8 text-xs bg-white"
                        min={startDate}
                      />
                   </div>
                </div>
                {startDate && endDate && (
                   <p className="text-xs text-right text-muted-foreground">Duration: <span className="font-bold text-foreground">{rentalDays} Days</span></p>
                )}
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>R{effectiveTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t border-muted-foreground/20">
              <span>Total</span>
              <span>R{effectiveTotal.toFixed(2)}</span>
            </div>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild disabled={hasHiringItems && (!startDate || !endDate)}>
                <Button className="w-full h-12 text-base font-medium shadow-md" size="lg" disabled={hasHiringItems && (!startDate || !endDate)}>
                   {hasHiringItems && (!startDate || !endDate) ? "Select Dates to Checkout" : "Proceed to Checkout"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif">Checkout & Delivery Details</DialogTitle>
                  <DialogDescription>
                    Please provide your contact and delivery information to complete your order.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCheckout} className="space-y-6 py-4">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Contact Information</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+27 00 000 0000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="email">Email Address *</Label>
                       <Input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                    </div>
                  </div>

                  {/* Hiring Specific - Event Details */}
                  {hasHiringItems && (
                    <div className="space-y-4 pt-2 border-t border-muted">
                       <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm text-purple-900 uppercase tracking-wider">Event Details</h4>
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Required for Hire</span>
                       </div>
                       
                       <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <Label>Event Type</Label>
                             <Input placeholder="e.g. Wedding, Birthday, Corporate" className="bg-purple-50/30 border-purple-100" />
                          </div>
                          <div className="space-y-2">
                             <Label>Venue Name</Label>
                             <Input placeholder="e.g. The Grand Hotel" className="bg-purple-50/30 border-purple-100" />
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Delivery Address */}
                  <div className="space-y-4 pt-2 border-t border-muted">
                    <div className="flex items-center gap-2">
                         <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">{hasHiringItems ? "Venue / Delivery Address" : "Shipping Address"}</h4>
                         <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                       <Label htmlFor="street">Street Address *</Label>
                       <Input id="street" value={formData.street} onChange={handleChange} required placeholder="123 Main Street" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" value={formData.city} onChange={handleChange} required placeholder="Cape Town" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province">Province *</Label>
                        <Input id="province" value={formData.province} onChange={handleChange} required placeholder="Western Cape" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input id="postalCode" value={formData.postalCode} onChange={handleChange} required placeholder="8000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" value={formData.country} onChange={handleChange} disabled className="bg-muted" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-muted">
                    <Label htmlFor="notes">{hasHiringItems ? "Additional Event Notes" : "Order Notes (Optional)"}</Label>
                    <Textarea 
                      id="notes" 
                      value={formData.notes} 
                      onChange={handleChange} 
                      placeholder={hasHiringItems ? "Special setup instructions, venue access codes, or specific requests." : "Delivery instructions or gift messages."}
                      className="min-h-[80px]"
                    />
                  </div>

                  <DialogFooter className="pt-4 sticky bottom-0 bg-background pb-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
