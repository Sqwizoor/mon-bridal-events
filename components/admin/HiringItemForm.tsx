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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, Sparkles, Tag, DollarSign, FileText, Image as ImageIcon, Trash2, ShieldCheck, Layers, X, Plus } from "lucide-react";

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

interface ColorTag {
  name: string;
  hex: string;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  hirePrice: z.string().min(1, "Hire price is required"),
  depositAmount: z.string().min(1, "Deposit amount is required"),
  category: z.literal("decor"),
  decorType: z.enum([
    "candle_holders", "vases", "table_linen", "underplates", "crockery", 
    "cutlery", "glassware", "cake_stands", "lanterns", "furniture", 
    "easels", "candy_jars", "chalkboards", "gift_holders", "lawn_games", 
    "pots_buckets", "table_decor", "miscellaneous"
  ]),
  images: z.array(z.instanceof(File)).optional(),
  stockQuantity: z.string().min(1, "Quantity is required"),
  sku: z.string().optional(),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isOnSale: z.boolean(),
});

type FormData = {
  name: string;
  description: string;
  hirePrice: string;
  depositAmount: string;
  category: "decor";
  decorType: "candle_holders" | "vases" | "table_linen" | "underplates" | "crockery" | "cutlery" | "glassware" | "cake_stands" | "lanterns" | "furniture" | "easels" | "candy_jars" | "chalkboards" | "gift_holders" | "lawn_games" | "pots_buckets" | "table_decor" | "miscellaneous";
  images?: File[];
  stockQuantity: string;
  sku?: string;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
};

interface HiringItemFormProps {
  onSuccess?: () => void;
}

export default function HiringItemForm({ onSuccess }: HiringItemFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [colorTags, setColorTags] = useState<ColorTag[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const createProduct = useMutation(api.products.create);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      hirePrice: "",
      isFeatured: false,
      isNew: false,
      isOnSale: false,
      depositAmount: "",
      category: "decor",
      decorType: "table_decor",
      images: [],
      stockQuantity: "1",
      sku: "",
    },
  });

  const imageFiles = watch("images");

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

      await (createProduct as any)({
        name: data.name,
        description: data.description,
        price: 0, // Base price for sale is 0 for hire items
        category: "decor",
        isFeatured: data.isFeatured,
        isNew: data.isNew,
        isOnSale: data.isOnSale,
        decorType: data.decorType,
        images: uploadedImages.length > 0 ? uploadedImages : undefined,
        imageStorageId: uploadedImages.length > 0 ? uploadedImages[0].storageId : undefined,
        stockQuantity: parseInt(data.stockQuantity),
        colors: colorTags.length > 0 ? colorTags.map(tag => ({ name: tag.name, hexCode: tag.hex })) : undefined,
        sku: data.sku,
        isForHire: true,
        hirePrice: parseFloat(data.hirePrice),
        depositAmount: parseFloat(data.depositAmount),
        isActive: true,
      });

      toast.success("Hiring item created successfully!");
      reset();
      setImagePreviews([]);
      setColorTags([]);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create hiring item");
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
            <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-800">
              <Sparkles className="h-5 w-5" />
              Item Details
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Vintage Gold Candelabra"
                {...register("name")}
                className="border-purple-100 focus:ring-purple-500"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the item's style and condition..."
                {...register("description")}
                className="border-purple-100 focus:ring-purple-500 min-h-30"
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="decorType">Decor Type</Label>
              <Select onValueChange={(val) => setValue("decorType", val as any)} defaultValue="table_decor">
                <SelectTrigger className="border-purple-100">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="max-h-75">
                  <SelectItem value="candle_holders">Candle Holders</SelectItem>
                  <SelectItem value="vases">Vases</SelectItem>
                  <SelectItem value="table_linen">Table Linen</SelectItem>
                  <SelectItem value="underplates">Underplates</SelectItem>
                  <SelectItem value="crockery">Crockery</SelectItem>
                  <SelectItem value="cutlery">Cutlery</SelectItem>
                  <SelectItem value="glassware">Glassware</SelectItem>
                  <SelectItem value="cake_stands">Cake Stands</SelectItem>
                  <SelectItem value="lanterns">Lanterns</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="easels">Easels</SelectItem>
                  <SelectItem value="candy_jars">Candy Jars</SelectItem>
                  <SelectItem value="chalkboards">Chalkboards</SelectItem>
                  <SelectItem value="gift_holders">Gift Holders</SelectItem>
                  <SelectItem value="lawn_games">Lawn Games</SelectItem>
                  <SelectItem value="pots_buckets">Pots & Buckets</SelectItem>
                  <SelectItem value="table_decor">Table Decor</SelectItem>
                  <SelectItem value="miscellaneous">Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku">SKU (Optional)</Label>
              <Input
                id="sku"
                placeholder="EV-001"
                {...register("sku")}
                className="border-purple-100 focus:ring-purple-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Colors (Optional)</Label>
              <div className="relative">
                <Input
                  id="color"
                  placeholder="Type or select a color..."
                  value={colorInput}
                  onChange={(e) => {
                    setColorInput(e.target.value);
                    setShowColorDropdown(true);
                  }}
                  onFocus={() => setShowColorDropdown(true)}
                  className="border-purple-100 focus:ring-purple-500"
                />
                {/* Color Dropdown */}
                {showColorDropdown && filteredColorOptions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredColorOptions.slice(0, 8).map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => addColorTag(color.name, color.hex)}
                        className="w-full px-3 py-2 text-left hover:bg-purple-50 flex items-center gap-2"
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
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hirePrice" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                Price Per Day (R) *
              </Label>
              <Input
                id="hirePrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("hirePrice")}
                className="border-purple-100 focus:ring-purple-500"
              />
              <p className="text-[10px] text-muted-foreground">Fee charged per day</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="depositAmount" className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-600" />
                Deposit (R) *
              </Label>
              <Input
                id="depositAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("depositAmount")}
                className="border-purple-100 focus:ring-purple-500"
              />
              <p className="text-[10px] text-muted-foreground">Refundable security deposit</p>
            </div>
            
            <div className="space-y-2 col-span-2 lg:col-span-1">
              <Label htmlFor="stockQuantity" className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-600" />
                Quantity
              </Label>
              <Input
                id="stockQuantity"
                type="number"
                {...register("stockQuantity")}
                className="border-purple-100 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-purple-100">
            <h3 className="text-sm font-semibold text-purple-800">Status & Visibility</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="flex flex-col items-start gap-3 p-3 border rounded-lg bg-purple-50/50 border-purple-100">
                <div className="flex items-center justify-between w-full">
                   <Label htmlFor="isFeatured" className="text-sm font-medium">Featured</Label>
                   <Switch
                     id="isFeatured"
                     checked={watch("isFeatured")}
                     onCheckedChange={(checked) => setValue("isFeatured", checked)}
                   />
                </div>
              </div>
              
              <div className="flex flex-col items-start gap-3 p-3 border rounded-lg bg-purple-50/50 border-purple-100">
                <div className="flex items-center justify-between w-full">
                  <Label htmlFor="isNew" className="text-sm font-medium">New Item</Label>
                  <Switch
                    id="isNew"
                    checked={watch("isNew")}
                    onCheckedChange={(checked) => setValue("isNew", checked)}
                  />
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 p-3 border rounded-lg bg-purple-50/50 border-purple-100">
                <div className="flex items-center justify-between w-full">
                  <Label htmlFor="isOnSale" className="text-sm font-medium">On Sale</Label>
                  <Switch
                    id="isOnSale"
                    checked={watch("isOnSale")}
                    onCheckedChange={(checked) => setValue("isOnSale", checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Media */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-800">
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
                className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-purple-200 rounded-xl cursor-pointer hover:bg-purple-50/50 transition-all group"
              >
                <div className="text-center p-6">
                  <div className="bg-purple-100 p-3 rounded-full inline-block mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-purple-900">Upload Item Images</p>
                  <p className="text-xs text-purple-600/70 mt-1">Select multiple high-quality photos</p>
                </div>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square group rounded-lg overflow-hidden border border-purple-100">
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
                      <div className="absolute bottom-0 left-0 right-0 bg-purple-600/90 text-[10px] text-white py-0.5 text-center">
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

      <div className="pt-4 border-t border-purple-50">
        <Button
          type="submit"
          disabled={uploading}
          className="w-full lg:w-auto px-8 h-12 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200/50 transition-all cursor-pointer"
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Item...
            </span>
          ) : (
            "Create Hiring Item"
          )}
        </Button>
      </div>
    </form>
  );
}
