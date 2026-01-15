"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

export default function CategoriesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("jewelry");
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalImageUrl, setExternalImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);

  const categories = useQuery(api.categories.getAll);
  const createCategory = useMutation(api.categories.create);
  const updateCategory = useMutation(api.categories.update);
  const deleteCategory = useMutation(api.categories.remove);
  const seedManual = useMutation(api.categories.seedManualCategories);

  const filteredCategories = categories?.filter(c => c.type === activeTab) || [];

  const handleOpen = (category?: any) => {
    if (category) {
      setEditingId(category._id);
      setName(category.name);
      setDescription(category.description || "");
      setExternalImageUrl(category.externalImageUrl || "");
      setDisplayOrder(category.displayOrder);
      setIsActive(category.isActive);
    } else {
      setEditingId(null);
      setName("");
      setDescription("");
      setExternalImageUrl("");
      setDisplayOrder(0);
      setIsActive(true);
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory({
          id: editingId as any,
          name,
          description,
          externalImageUrl,
          displayOrder: Number(displayOrder),
          isActive,
        });
        toast.success("Category updated successfully");
      } else {
        await createCategory({
          name,
          type: activeTab as "jewelry" | "decor",
          description,
          externalImageUrl,
          displayOrder: Number(displayOrder),
        });
        toast.success("Category created successfully");
      }
      setIsOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory({ id: id as any });
        toast.success("Category deleted");
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleSeed = async () => {
    try {
        await seedManual();
        toast.success("Manual categories seeded!");
    } catch (error) {
        toast.error("Failed to seed categories");
        console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-amber-900">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage product categories for Jewelry and Rentals (Decor)
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleSeed} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Seed Manual Defaults
            </Button>
            <Button onClick={() => handleOpen()} className="gap-2 bg-linear-to-r from-amber-600 to-orange-600">
            <Plus className="h-4 w-4" />
            Add Category
            </Button>
        </div>
      </div>

      <Card className="border-amber-100 shadow-sm">
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="jewelry">Jewelry Categories</TabsTrigger>
              <TabsTrigger value="decor">Rental (Decor) Categories</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
                <div className="rounded-md border">
                    <div className="grid grid-cols-12 border-b bg-muted/50 p-4 font-medium text-sm">
                        <div className="col-span-1">Img</div>
                        <div className="col-span-3">Name</div>
                        <div className="col-span-3">Slug</div>
                        <div className="col-span-1">Order</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                    <div className="divide-y">
                        {filteredCategories.length === 0 ? (
                             <div className="p-8 text-center text-muted-foreground">
                                No categories found. Create one or seed defaults.
                             </div>
                        ) : (
                            filteredCategories.map((cat) => (
                                <div key={cat._id} className="grid grid-cols-12 items-center p-4 text-sm hover:bg-muted/5">
                                    <div className="col-span-1">
                                        {cat.imageUrl ? (
                                            <div className="relative h-10 w-10 overflow-hidden rounded-md border">
                                                <Image 
                                                    src={cat.imageUrl} 
                                                    alt={cat.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-span-3 font-medium">{cat.name}</div>
                                    <div className="col-span-3 text-muted-foreground">{cat.slug}</div>
                                    <div className="col-span-1">{cat.displayOrder}</div>
                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                            cat.isActive 
                                            ? "bg-green-50 text-green-700 ring-green-600/20" 
                                            : "bg-red-50 text-red-700 ring-red-600/20"
                                        }`}>
                                            {cat.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="col-span-2 flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpen(cat)}>
                                            <Pencil className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat._id)}>
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
          </Tabs>
        </CardHeader>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{editingId ? "Edit Category" : "Add New Category"}</DialogTitle>
                <DialogDescription>
                    {activeTab === "jewelry" ? "Jewelry" : "Rental/Decor"} category details.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input id="image" value={externalImageUrl} onChange={(e) => setExternalImageUrl(e.target.value)} placeholder="https://..." />
                    <p className="text-xs text-muted-foreground">URL to an image (e.g. Unsplash)</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="order">Display Order</Label>
                        <Input id="order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
                    </div>
                    {editingId && (
                        <div className="space-y-2 flex flex-col pt-6">
                            <div className="flex items-center space-x-2">
                                <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                                <Label htmlFor="active">Active</Label>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button type="submit">{editingId ? "Save Changes" : "Create Category"}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
