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
import { Upload, Package, Tag, DollarSign, FileText, Image as ImageIcon, Trash2, X, Plus } from "lucide-react";

// Common color options with hex codes
const COLOR_OPTIONS = [
  { name: "Gold", hex: "#FFD700" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#FF0000" },
  { name: "Blue", hex: "#0000FF" },
  { name: "Green", hex: "#008000" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Purple", hex: "#800080" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Yellow", hex: "#FFFF00" },
  { name: "Bronze", hex: "#CD7F32" },
  { name: "Copper", hex: "#B87333" },
  { name: "Platinum", hex: "#E5E4E2" },
  { name: "Pearl", hex: "#F0EAD6" },
  { name: "Champagne", hex: "#F7E7CE" },
  { name: "Navy", hex: "#000080" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Teal", hex: "#008080" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Gray", hex: "#808080" },
  { name: "Clear", hex: "#E0E0E0" },
];

// Helper function to get hex code for a color name
const getColorHex = (colorName: string): string => {
  const color = COLOR_OPTIONS.find(c => c.name.toLowerCase() === colorName.toLowerCase());
  return color?.hex || "#CCCCCC";
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  compareAtPrice: z.string().optional(),
  category: z.literal("jewelry"),
  jewelryType: z.enum(["rings", "necklaces", "earrings", "bracelets", "brooches", "sets", "anklets", "hair_accessories", "other"]),
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
  isFeatured?: boolean;
  isOnSale?: boolean;
  saleEndDate?: string;
  images?: File[];
  stockQuantity: string;
  sku?: string;
};

interface ColorTag {
  name: string;
  hex: string;
}

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function ProductForm({ onSuccess }: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [colorTags, setColorTags] = useState<ColorTag[]>([]);
  const [sizeTags, setSizeTags] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [showColorDropdown, setShowColorDropdown] = useState(false);
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

  // Filter color options based on input
  const filteredColorOptions = COLOR_OPTIONS.filter(
    color => color.name.toLowerCase().includes(colorInput.toLowerCase()) &&
    !colorTags.some(tag => tag.name.toLowerCase() === color.name.toLowerCase())
  );

  const addColorTag = (colorName: string, hexCode?: string) => {
    const hex = hexCode || getColorHex(colorName);
    if (!colorTags.some(tag => tag.name.toLowerCase() === colorName.toLowerCase())) {
      setColorTags([...colorTags, { name: colorName, hex }]);
    }
    setColorInput("");
    setShowColorDropdown(false);
  };

  const removeColorTag = (index: number) => {
    setColorTags(colorTags.filter((_, i) => i !== index));
  };

  const addSizeTag = () => {
    const trimmed = sizeInput.trim();
    if (trimmed && !sizeTags.includes(trimmed)) {
      setSizeTags([...sizeTags, trimmed]);
    }
    setSizeInput("");
  };

  const removeSizeTag = (index: number) => {
    setSizeTags(sizeTags.filter((_, i) => i !== index));
  };

  const handleSizeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSizeTag();
    }
  };

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

      const colors = colorTags.map(tag => ({ name: tag.name, hexCode: tag.hex }));

      const sizes = sizeTags.map(name => ({ name }));

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
      setColorTags([]);
      setSizeTags([]);
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
                className="border-amber-100 focus:ring-amber-500 min-h-30"
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
              <div className="relative">
                <Input
                  id="colors"
                  placeholder="Type or select a color..."
                  value={colorInput}
                  onChange={(e) => {
                    setColorInput(e.target.value);
                    setShowColorDropdown(true);
                  }}
                  onFocus={() => setShowColorDropdown(true)}
                  className="border-amber-100 focus:ring-amber-500"
                />
                {/* Color Dropdown */}
                {showColorDropdown && filteredColorOptions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredColorOptions.slice(0, 8).map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => addColorTag(color.name, color.hex)}
                        className="w-full px-3 py-2 text-left hover:bg-amber-50 flex items-center gap-2"
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-sm">{color.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Color Tags */}
              {colorTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: tag.hex }}
                      />
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => removeColorTag(index)}
                        className="ml-0.5 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sizes">Sizes (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="sizes"
                  placeholder="e.g., Small, Medium, Large"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyDown={handleSizeKeyDown}
                  className="border-amber-100 focus:ring-amber-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addSizeTag}
                  className="shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {/* Size Tags */}
              {sizeTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {sizeTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeSizeTag(index)}
                        className="ml-0.5 hover:text-red-500 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
          className="w-full lg:w-auto px-8 h-12 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-amber-200/50 transition-all cursor-pointer"
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
