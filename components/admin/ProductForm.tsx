"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Package, Tag, DollarSign, FileText, Image as ImageIcon, Trash2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  compareAtPrice: z.string().optional(),
  category: z.literal("jewelry"),
  jewelryType: z.enum(["rings", "necklaces", "earrings", "bracelets", "brooches", "sets", "anklets", "hair_accessories", "other"]),
  colors: z.string().optional(),
  sizes: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  saleEndDate: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
  stockQuantity: z.string().min(1, "Stock is required"),
  sku: z.string().optional(),
});

type FormData = {
  name: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  category: "jewelry";
  jewelryType: "rings" | "necklaces" | "earrings" | "bracelets" | "brooches" | "sets" | "anklets" | "hair_accessories" | "other";
  colors?: string;
  sizes?: string;
  isFeatured?: boolean;
  isOnSale?: boolean;
  saleEndDate?: string;
  images?: File[];
  stockQuantity: string;
  sku?: string;
};

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const createProduct = useMutation(api.products.create);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      compareAtPrice: "",
      category: "jewelry",
      jewelryType: "rings",
      colors: "",
      sizes: "",
      isFeatured: false,
      isOnSale: false,
      saleEndDate: "",
      images: [],
      stockQuantity: "1",
      sku: "",
    },
  });

  const imageFiles = watch("images");
  const isOnSale = watch("isOnSale");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      const currentFiles = imageFiles || [];
      const newFiles = [...currentFiles, ...files];
      setValue("images", newFiles);
      
      const previews: string[] = [];
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          if (previews.length === newFiles.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    
    const currentFiles = imageFiles || [];
    const newFiles = currentFiles.filter((_, i) => i !== index);
    setValue("images", newFiles);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setUploading(true);
      
      const uploadedImages: any[] = [];

      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          const image = data.images[i];
          const postUrl = await generateUploadUrl();
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": image.type },
            body: image,
          });
          const { storageId } = await result.json();
          uploadedImages.push({
            storageId,
            alt: `${data.name} - Image ${i + 1}`,
            isPrimary: i === 0,
            displayOrder: i,
          });
        }
      }

      const colors = (data.colors ?? "")
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c)
        .map((name) => ({ name }));

      const sizes = (data.sizes ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)
        .map((name) => ({ name }));

      await (createProduct as any)({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price) || 0,
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : undefined,
        category: "jewelry",
        jewelryType: data.jewelryType,
        colors: colors.length > 0 ? colors : undefined,
        sizes: sizes.length > 0 ? sizes : undefined,
        isFeatured: data.isFeatured ?? false,
        isOnSale: data.isOnSale ?? false,
        saleEndDate:
          data.isOnSale && data.saleEndDate
            ? new Date(`${data.saleEndDate}T23:59:59.999`).getTime()
            : undefined,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
        imageStorageId: uploadedImages.length > 0 ? uploadedImages[0].storageId : undefined,
        stockQuantity: parseInt(data.stockQuantity) || 1,
        sku: data.sku,
        isForHire: false,
        isActive: true,
      });

      toast.success("Jewelry product created successfully!");
      reset();
      setImagePreviews([]);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create product");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-800">
              <Package className="h-5 w-5" />
              Product Essentials
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Jewelry Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Diamond Engagement Ring"
                {...register("name")}
                className="border-amber-100 focus:ring-amber-500"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Crafted with elegance..."
                {...register("description")}
                className="border-amber-100 focus:ring-amber-500 min-h-[120px]"
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jewelryType">Jewelry Type</Label>
              <Select onValueChange={(val) => setValue("jewelryType", val as any)} defaultValue="rings">
                <SelectTrigger className="border-amber-100">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rings">Rings</SelectItem>
                  <SelectItem value="necklaces">Necklaces</SelectItem>
                  <SelectItem value="earrings">Earrings</SelectItem>
                  <SelectItem value="bracelets">Bracelets</SelectItem>
                  <SelectItem value="brooches">Brooches</SelectItem>
                  <SelectItem value="sets">Sets</SelectItem>
                  <SelectItem value="anklets">Anklets</SelectItem>
                  <SelectItem value="hair_accessories">Hair Accessories</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku">SKU (Optional)</Label>
              <Input
                id="sku"
                placeholder="JR-001"
                {...register("sku")}
                className="border-amber-100 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (R) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-600" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price")}
                  className="pl-9 border-amber-100 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                {...register("stockQuantity")}
                className="border-amber-100 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="compareAtPrice">Regular Price (R)</Label>
              <Input
                id="compareAtPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("compareAtPrice")}
                className="border-amber-100 focus:ring-amber-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="saleEndDate">Sale End Date</Label>
              <Input
                id="saleEndDate"
                type="date"
                disabled={!isOnSale}
                {...register("saleEndDate")}
                className="border-amber-100 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={watch("isFeatured")}
                onCheckedChange={(checked) => setValue("isFeatured", checked)}
                className="cursor-pointer"
              />
              <Label htmlFor="isFeatured" className="cursor-pointer">Featured</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isOnSale"
                checked={!!isOnSale}
                onCheckedChange={(checked) => {
                  setValue("isOnSale", checked);
                  if (!checked) setValue("saleEndDate", "");
                }}
                className="cursor-pointer"
              />
              <Label htmlFor="isOnSale" className="cursor-pointer">On Sale</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="colors">Colors (Optional)</Label>
              <Input
                id="colors"
                placeholder="e.g., Gold, Silver, Rose Gold"
                {...register("colors")}
                className="border-amber-100 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sizes">Sizes (Optional)</Label>
              <Input
                id="sizes"
                placeholder="e.g., Small, Medium, Large"
                {...register("sizes")}
                className="border-amber-100 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Media */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-800">
              <ImageIcon className="h-5 w-5" />
              Media & Images
            </h3>
            
            <div className="relative">
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-amber-200 rounded-xl cursor-pointer hover:bg-amber-50/50 transition-all group"
              >
                <div className="text-center p-6">
                  <div className="bg-amber-100 p-3 rounded-full inline-block mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 text-amber-600" />
                  </div>
                  <p className="text-sm font-medium text-amber-900">Upload Product Images</p>
                  <p className="text-xs text-amber-600/70 mt-1">Select multiple high-quality photos</p>
                </div>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border border-amber-100">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-amber-600/90 text-[10px] text-white py-0.5 text-center">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-amber-50">
        <Button
          type="submit"
          disabled={uploading}
          className="w-full lg:w-auto px-8 h-12 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-amber-200/50 transition-all cursor-pointer"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            "Create Luxury Product"
          )}
        </Button>
      </div>
    </form>
  );
}
