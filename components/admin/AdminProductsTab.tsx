"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Search,
  Filter,
  ShoppingBag,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

const JEWELRY_TYPES = [
  { value: "rings", label: "Rings" },
  { value: "necklaces", label: "Necklaces" },
  { value: "earrings", label: "Earrings" },
  { value: "bracelets", label: "Bracelets" },
  { value: "brooches", label: "Brooches" },
  { value: "sets", label: "Jewelry Sets" },
  { value: "anklets", label: "Anklets" },
  { value: "hair_accessories", label: "Hair Accessories" },
  { value: "other", label: "Other" },
];

const DECOR_TYPES = [
  { value: "candle_holders", label: "Candle Holders" },
  { value: "vases", label: "Vases" },
  { value: "table_linen", label: "Table Linen" },
  { value: "underplates", label: "Underplates" },
  { value: "crockery", label: "Crockery & Serveware" },
  { value: "cutlery", label: "Cutlery" },
  { value: "glassware", label: "Coloured Glassware" },
  { value: "cake_stands", label: "Cake & Cupcake Stands" },
  { value: "lanterns", label: "Lanterns" },
  { value: "furniture", label: "Furniture" },
  { value: "easels", label: "Easels" },
  { value: "candy_jars", label: "Candy Jars" },
  { value: "chalkboards", label: "Chalkboards" },
  { value: "gift_holders", label: "Gift & Card Holders" },
  { value: "lawn_games", label: "Lawn Games" },
  { value: "pots_buckets", label: "Pots & Buckets" },
  { value: "table_decor", label: "Table Decor" },
  { value: "miscellaneous", label: "Miscellaneous" },
];

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  compareAtPrice: string;
  category: "jewelry" | "decor";
  jewelryType: string;
  decorType: string;
  stockQuantity: string;
  isActive: boolean;
  isForHire: boolean;
  hirePrice: string;
  depositAmount: string;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  saleEndDate: string;
  colors: string;
  materials: string;
  tags: string;
  images: File[];
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  description: "",
  price: "",
  compareAtPrice: "",
  category: "jewelry",
  jewelryType: "",
  decorType: "",
  stockQuantity: "1",
  isActive: true,
  isForHire: false,
  hirePrice: "",
  depositAmount: "",
  isFeatured: false,
  isNew: true,
  isOnSale: false,
  saleEndDate: "",
  colors: "",
  materials: "",
  tags: "",
  images: [],
};

interface AdminProductsTabProps {
  initialCategory?: "jewelry" | "decor" | "all";
}

export default function AdminProductsTab({ initialCategory = "all" }: AdminProductsTabProps) {
  const products = useQuery(api.products.getAll);
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const deleteProduct = useMutation(api.products.remove);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>(initialCategory);

  const resetForm = () => {
    setFormData(initialFormData);
    setImagePreviews([]);
    setExistingImages([]);
    setEditingProduct(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setFormData({
      ...initialFormData,
      name: product.name,
      description: product.description,
      description: product.description,
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || "",
      category: product.category,
      jewelryType: product.jewelryType || "",
      decorType: product.decorType || "",
      stockQuantity: product.stockQuantity.toString(),
      isActive: product.isActive ?? true,
      isForHire: product.isForHire,
      hirePrice: product.hirePrice?.toString() || "",
      depositAmount: product.depositAmount?.toString() || "",
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false,
      isOnSale: product.isOnSale || false,
      saleEndDate: product.saleEndDate ? new Date(product.saleEndDate).toISOString().slice(0, 10) : "",
      colors: product.colors?.map((c: any) => c.name).join(", ") || "",
      materials: product.materials?.join(", ") || "",
      tags: product.tags?.join(", ") || "",
      images: [],
    });
    
    if (product.images) {
      setExistingImages(product.images);
    } else if (product.imageUrl) {
      setExistingImages([{ 
        storageId: product.imageStorageId, 
        url: product.imageUrl,
        isPrimary: true, 
        displayOrder: 0 
      }]);
    }
    
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setFormData({ ...formData, images: [...formData.images, ...files] });
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalImages: any[] = [...existingImages.map(img => ({
        storageId: img.storageId,
        alt: img.alt,
        isPrimary: img.isPrimary,
        displayOrder: img.displayOrder
      }))];

      // Upload new images if selected
      if (formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          const file = formData.images[i];
          const uploadUrl = await generateUploadUrl();
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          });
          const { storageId } = await result.json();
          
          finalImages.push({
            storageId,
            alt: `${formData.name} - ${finalImages.length + 1}`,
            isPrimary: finalImages.length === 0,
            displayOrder: finalImages.length,
          });
        }
      }

      // Ensure at least one image is primary if any exist
      if (finalImages.length > 0 && !finalImages.some(img => img.isPrimary)) {
        finalImages[0].isPrimary = true;
      }

      // Update display orders
      finalImages.forEach((img, idx) => {
        img.displayOrder = idx;
      });

      // Parse colors
      const colors = formData.colors
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c)
        .map((name) => ({ name }));

      // Parse materials
      const materials = formData.materials
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m);

      // Parse tags
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : undefined,
        category: formData.category,
        jewelryType:
          formData.category === "jewelry" ? formData.jewelryType : undefined,
        decorType:
          formData.category === "decor" ? formData.decorType : undefined,
        stockQuantity: parseInt(formData.stockQuantity) || 1,
        isActive: formData.isActive,
        isForHire: formData.isForHire,
        hirePrice: formData.hirePrice
          ? parseFloat(formData.hirePrice)
          : undefined,
        depositAmount: formData.depositAmount
          ? parseFloat(formData.depositAmount)
          : undefined,
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        isOnSale: formData.isOnSale,
        saleEndDate:
          formData.isOnSale && formData.saleEndDate
            ? new Date(`${formData.saleEndDate}T23:59:59.999`).getTime()
            : undefined,
        colors: colors.length > 0 ? colors : undefined,
        materials: materials.length > 0 ? materials : undefined,
        tags: tags.length > 0 ? tags : undefined,
        images: finalImages.length > 0 ? finalImages : undefined,
        imageStorageId: finalImages.find(img => img.isPrimary)?.storageId,
      };

      if (editingProduct) {
        await updateProduct({
          id: editingProduct._id,
          ...productData,
        });
        toast.success("Product updated successfully!");
      } else {
        await createProduct(productData);
        toast.success("Product created successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: Id<"products">) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct({ id });
        toast.success("Product deleted successfully!");
      } catch (error: any) {
        toast.error(error.message || "Failed to delete product");
      }
    }
  };

  // Filter products
  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-muted/60 focus:ring-primary"
            />
          </div>
          {initialCategory === "all" && (
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] h-11 cursor-pointer border-muted/60">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">All Categories</SelectItem>
                <SelectItem value="jewelry" className="cursor-pointer">Jewelry</SelectItem>
                <SelectItem value="decor" className="cursor-pointer">Decor</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Products Table */}
        <div className="rounded-xl border border-muted/60 overflow-hidden bg-background">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[80px]">Preview</TableHead>
                <TableHead>Name & SKU</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingBag className="h-8 w-8 opacity-20" />
                      <p>No items found in this section</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts?.map((product) => (
                  <TableRow key={product._id} className="hover:bg-muted/10 transition-colors group">
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-muted/60">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground leading-none">{product.name}</span>
                        {product.sku && (
                          <span className="text-[10px] font-mono text-muted-foreground mt-1">{product.sku}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category === "jewelry" && (
                        <Badge variant="outline" className="capitalize font-medium border-amber-200 bg-amber-50/50 text-amber-700">
                          {product.jewelryType?.replace("_", " ") || "Jewelry"}
                        </Badge>
                      )}
                      {product.category === "decor" && (
                        <Badge variant="outline" className="capitalize font-medium border-purple-200 bg-purple-50/50 text-purple-700">
                          {product.decorType?.replace("_", " ") || "Hiring"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.category === "jewelry" ? (
                        <div className="font-bold text-amber-900">R{product.price.toFixed(2)}</div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="font-bold text-purple-900">R{product.hirePrice?.toFixed(2)}<span className="text-[10px] font-normal text-muted-foreground ml-1">/day</span></div>
                          {product.depositAmount && (
                            <div className="text-[10px] text-muted-foreground">Dep: R{product.depositAmount.toFixed(2)}</div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          product.stockQuantity <= 5 ? "bg-red-500 animate-pulse" : "bg-green-500"
                        )} />
                        <span className="font-medium">{product.stockQuantity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.isActive ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20 shadow-none px-1.5 h-5 text-[10px] uppercase tracking-wider font-bold">Active</Badge>
                        ) : (
                          <Badge variant="secondary" className="px-1.5 h-5 text-[10px] uppercase tracking-wider font-bold">Inactive</Badge>
                        )}
                        {product.isFeatured && (
                          <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-200 hover:bg-indigo-500/20 shadow-none px-1.5 h-5 text-[10px] uppercase tracking-wider font-bold">Featured</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(product)}
                          className="h-8 w-8 cursor-pointer hover:bg-primary/10 hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Simplified Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl border-muted/60 p-0">
            <DialogHeader className="p-6 bg-muted/30 border-b border-muted/60">
              <DialogTitle className="text-xl font-serif">Update Item Details</DialogTitle>
              <DialogDescription>
                Modify information for <span className="font-semibold text-foreground">{formData.name}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="name">Display Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-11"
                    />
                  </div>



                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="description">Full Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Images */}
                  <div className="md:col-span-2 space-y-4">
                    <Label>Product Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Existing Images */}
                      {existingImages.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-muted">
                          <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                          {img.isPrimary && (
                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* New Image Previews */}
                      {imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-muted">
                          <img src={preview} alt="New" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}

                      {/* Upload Button */}
                      <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-muted hover:border-primary/50 cursor-pointer transition-colors bg-muted/10">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground font-medium">Add Images</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val: "jewelry" | "decor") => {
                        setFormData({ 
                          ...formData, 
                          category: val,
                          jewelryType: val === "jewelry" ? JEWELRY_TYPES[0].value : "",
                          decorType: val === "decor" ? DECOR_TYPES[0].value : ""
                        });
                      }}
                    >
                      <SelectTrigger className="h-11 cursor-pointer">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jewelry" className="cursor-pointer">Jewelry</SelectItem>
                        <SelectItem value="decor" className="cursor-pointer">Decor & Hiring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtype">Classification</Label>
                    <Select
                      value={formData.category === "jewelry" ? formData.jewelryType : formData.decorType}
                      onValueChange={(val) => setFormData({ ...formData, [formData.category === "jewelry" ? "jewelryType" : "decorType"]: val })}
                    >
                      <SelectTrigger className="h-11 cursor-pointer">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {(formData.category === "jewelry" ? JEWELRY_TYPES : DECOR_TYPES).map((type) => (
                          <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Available Stock</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      className="h-11"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="colors">Colors (comma separated)</Label>
                    <Input
                      id="colors"
                      value={formData.colors}
                      onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                      placeholder="e.g. Gold, Silver, Rose Gold"
                      className="h-11"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="materials">Materials (comma separated)</Label>
                    <Input
                      id="materials"
                      value={formData.materials}
                      onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                      placeholder="e.g. 18k Gold, Sterling Silver"
                      className="h-11"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="e.g. Wedding, Party, Summer"
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Pricing Block */}
                <div className="p-4 rounded-xl bg-muted/20 border border-muted/60">
                  <div
                    className={cn(
                      "grid gap-4",
                      formData.category === "decor"
                        ? "grid-cols-1 md:grid-cols-3"
                        : "grid-cols-2"
                    )}
                  >
                    {formData.category === "jewelry" ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="price">Sale Price (R)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="compareAtPrice">Regular Price (R)</Label>
                          <Input
                            id="compareAtPrice"
                            type="number"
                            step="0.01"
                            value={formData.compareAtPrice}
                            onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                            placeholder="Original price"
                            className="h-11"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="hirePrice">Price Per Day (R)</Label>
                          <Input
                            id="hirePrice"
                            type="number"
                            step="0.01"
                            value={formData.hirePrice}
                            onChange={(e) => setFormData({ ...formData, hirePrice: e.target.value })}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="compareAtPrice">Regular Hire Fee (R)</Label>
                          <Input
                            id="compareAtPrice"
                            type="number"
                            step="0.01"
                            value={formData.compareAtPrice}
                            onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                            placeholder="Original hire fee"
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="depositAmount">Security Deposit (R)</Label>
                          <Input
                            id="depositAmount"
                            type="number"
                            step="0.01"
                            value={formData.depositAmount}
                            onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                            className="h-11"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="isActive" className="cursor-pointer font-medium">Visible in Catalog</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="isFeatured" className="cursor-pointer font-medium">Promoted/Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isNew"
                      checked={formData.isNew}
                      onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked })}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="isNew" className="cursor-pointer font-medium">New Arrival</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isOnSale"
                      checked={formData.isOnSale}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isOnSale: checked,
                          saleEndDate: checked ? formData.saleEndDate : "",
                        })
                      }
                      className="cursor-pointer"
                    />
                    <Label htmlFor="isOnSale" className="cursor-pointer font-medium">On Sale</Label>
                  </div>
                </div>

                {formData.isOnSale && (
                  <div className="pt-2">
                    <div className="space-y-2 max-w-xs">
                      <Label htmlFor="saleEndDate">Sale End Date</Label>
                      <Input
                        id="saleEndDate"
                        type="date"
                        value={formData.saleEndDate}
                        onChange={(e) => setFormData({ ...formData, saleEndDate: e.target.value })}
                        className="h-11"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-muted/60">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="cursor-pointer h-11 px-6 hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="cursor-pointer h-11 px-8 min-w-[120px]"
                  >
                    {isSubmitting ? "Syncing..." : "Apply Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
