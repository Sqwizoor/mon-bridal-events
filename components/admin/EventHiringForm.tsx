"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, MapPin, Users, MessageSquare, Layers, Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EventHiringFormProps {
  onSuccess?: () => void;
}

export default function EventHiringForm({ onSuccess }: EventHiringFormProps) {
  const products = useQuery(api.products.list);
  const createHireRequest = useMutation(api.hireRequests.create);

  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    eventDate: "",
    eventEndDate: "",
    eventType: "",
    venue: "",
    message: "",
  });

  const [selectedItems, setSelectedItems] = useState<
    Array<{
      productId: Id<"products">;
      name: string;
      quantity: number;
      hirePrice: number;
    }>
  >([]);

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [hirePrice, setHirePrice] = useState(0);

  const selectedProduct = products?.find(p => p._id === selectedProductId);

  const handleAddItem = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    const newItem = {
      productId: selectedProduct._id,
      name: selectedProduct.name,
      quantity,
      hirePrice: hirePrice || selectedProduct.hirePrice || 0,
    };

    setSelectedItems([...selectedItems, newItem]);
    setSelectedProductId("");
    setQuantity(1);
    setHirePrice(0);
    toast.success("Item added to request");
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.guestName) {
      toast.error("Guest name is required");
      return;
    }
    if (!formData.eventDate) {
      toast.error("Event date is required");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    try {
      await createHireRequest({
        items: selectedItems,
        eventDate: formData.eventDate,
        eventEndDate: formData.eventEndDate || undefined,
        eventType: formData.eventType || undefined,
        venue: formData.venue || undefined,
        message: formData.message || undefined,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail || undefined,
        guestPhone: formData.guestPhone || undefined,
      });

      toast.success("Hire request created successfully");
      setFormData({
        guestName: "",
        guestEmail: "",
        guestPhone: "",
        eventDate: "",
        eventEndDate: "",
        eventType: "",
        venue: "",
        message: "",
      });
      setSelectedItems([]);
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create hire request");
      console.error(error);
    }
  };

  const estimatedTotal = selectedItems.reduce(
    (sum, item) => sum + item.hirePrice * item.quantity,
    0
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Guest Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-purple-800 border-b border-purple-100 pb-2">
          <Users className="h-5 w-5" />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Guest Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="guestName" className="text-xs font-bold uppercase text-muted-foreground">Guest Name *</Label>
            <Input
              id="guestName"
              placeholder="e.g. John Doe"
              value={formData.guestName}
              onChange={(e) =>
                setFormData({ ...formData, guestName: e.target.value })
              }
              className="border-purple-100 focus:ring-purple-500 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestEmail" className="text-xs font-bold uppercase text-muted-foreground">Email Address</Label>
            <Input
              id="guestEmail"
              type="email"
              placeholder="guest@example.com"
              value={formData.guestEmail}
              onChange={(e) =>
                setFormData({ ...formData, guestEmail: e.target.value })
              }
              className="border-purple-100 focus:ring-purple-500 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guestPhone" className="text-xs font-bold uppercase text-muted-foreground">Phone Number</Label>
            <Input
              id="guestPhone"
              placeholder="+27..."
              value={formData.guestPhone}
              onChange={(e) =>
                setFormData({ ...formData, guestPhone: e.target.value })
              }
              className="border-purple-100 focus:ring-purple-500 h-11"
            />
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-purple-800 border-b border-purple-100 pb-2">
          <Calendar className="h-5 w-5" />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Event Logistics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-xs font-bold uppercase text-muted-foreground">Start Date *</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventDate: e.target.value })
                }
                className="border-purple-100 focus:ring-purple-500 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventEndDate" className="text-xs font-bold uppercase text-muted-foreground">End Date</Label>
              <Input
                id="eventEndDate"
                type="date"
                value={formData.eventEndDate}
                onChange={(e) =>
                  setFormData({ ...formData, eventEndDate: e.target.value })
                }
                className="border-purple-100 focus:ring-purple-500 h-11"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventType" className="text-xs font-bold uppercase text-muted-foreground">Event Type</Label>
            <Input
              id="eventType"
              placeholder="e.g. Wedding Ceremony"
              value={formData.eventType}
              onChange={(e) =>
                setFormData({ ...formData, eventType: e.target.value })
              }
              className="border-purple-100 focus:ring-purple-500 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue" className="text-xs font-bold uppercase text-muted-foreground">Venue Location</Label>
            <Input
              id="venue"
              placeholder="Venue address or name"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              className="border-purple-100 focus:ring-purple-500 h-11"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="message" className="text-xs font-bold uppercase text-muted-foreground">Special Instructions</Label>
            <Textarea
              id="message"
              placeholder="Any additional requirements or setup notes..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="border-purple-100 focus:ring-purple-500 min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Items Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-purple-800 border-b border-purple-100 pb-2">
          <Layers className="h-5 w-5" />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Hiring Items</h3>
        </div>
        
        <Card className="bg-purple-50/30 border-purple-100 shadow-none">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Select Product</Label>
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger className="h-11 border-purple-100 bg-white cursor-pointer">
                    <SelectValue placeholder="Choose a decor item..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {products?.filter(p => p.category === "decor").map((product: any) => (
                      <SelectItem key={product._id} value={product._id} className="cursor-pointer">
                        {product.name} (R{product.hirePrice || 0}/day)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="h-11 border-purple-100 bg-white"
                />
              </div>
              <div className="md:col-span-3 space-y-2">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Custom Price (R)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={selectedProduct?.hirePrice?.toString() || "0.00"}
                  value={hirePrice || ""}
                  onChange={(e) => setHirePrice(parseFloat(e.target.value) || 0)}
                  className="h-11 border-purple-100 bg-white"
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full h-11 gap-2 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Items List */}
        {selectedItems.length > 0 && (
          <div className="rounded-xl border border-purple-100 overflow-hidden bg-white">
            <div className="bg-purple-50/50 px-4 py-3 border-b border-purple-100">
              <span className="text-xs font-bold uppercase text-purple-800">Booking Summary</span>
            </div>
            <div className="divide-y divide-purple-50">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-purple-50/20 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-purple-900">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} units &times; R{item.hirePrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-purple-700">R{(item.quantity * item.hirePrice).toFixed(2)}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-linear-to-r from-purple-600 to-pink-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 opacity-80" />
                <span className="font-medium tracking-wide uppercase text-xs">Estimated Total</span>
              </div>
              <span className="text-2xl font-black">R{estimatedTotal.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-purple-50 flex justify-end">
        <Button
          type="submit"
          className="w-full md:w-auto px-12 h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 cursor-pointer transition-all active:scale-[0.98]"
        >
          Generate Hire Booking
        </Button>
      </div>
    </form>
  );
}
