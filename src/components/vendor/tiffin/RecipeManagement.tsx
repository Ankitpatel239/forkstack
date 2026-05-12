'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Search, 
  ChefHat, 
  ArrowRight, 
  Info,
  Scale,
  TrendingUp,
  Package,
  Check,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  getRecipes, 
  createRecipe, 
  updateRecipe, 
  deleteRecipe, 
  getInventoryItems, 
  getMenuItems 
} from "@/app/actions/recipes";
import { getTiffinItems } from "@/app/actions/tiffin";

interface RecipeManagementProps {
  vendorId: string;
}

export default function RecipeManagement({ vendorId }: RecipeManagementProps) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [tiffinItems, setTiffinItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<any>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [r, i, m, t] = await Promise.all([
        getRecipes(vendorId),
        getInventoryItems(vendorId),
        getMenuItems(vendorId),
        getTiffinItems(vendorId)
      ]);
      setRecipes(r);
      setInventoryItems(i);
      setMenuItems(m);
      setTiffinItems(t);
    } catch (error) {
      toast.error("Failed to load recipe data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vendorId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteRecipe(id);
      toast.success("Recipe deleted");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-card/30 backdrop-blur-xl p-6 rounded-3xl border border-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <ChefHat className="text-orange-500" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase italic">Recipe Engine</h3>
            <p className="text-xs text-muted-foreground font-bold tracking-widest">Map Ingredients to Menu Items</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingRecipe(null);
        }}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest shadow-xl shadow-orange-500/20">
              <Plus className="mr-2" size={20} /> Create Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-background/95 backdrop-blur-3xl border-border">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black uppercase italic">
                {editingRecipe ? 'Edit Recipe' : 'New Culinary Blueprint'}
              </DialogTitle>
            </DialogHeader>
            <RecipeForm 
              vendorId={vendorId} 
              inventoryItems={inventoryItems} 
              menuItems={menuItems}
              tiffinItems={tiffinItems}
              initialData={editingRecipe}
              onSuccess={() => {
                setIsDialogOpen(false);
                fetchData();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-orange-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onEdit={() => {
                setEditingRecipe(recipe);
                setIsDialogOpen(true);
              }}
              onDelete={() => handleDelete(recipe.id)}
            />
          ))}
          {recipes.length === 0 && (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-border rounded-[3rem]">
              <p className="text-muted-foreground font-bold uppercase tracking-widest">No recipes created yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RecipeCard({ recipe, onEdit, onDelete }: { recipe: any, onEdit: () => void, onDelete: () => void }) {
  const totalCost = useMemo(() => {
    return recipe.ingredients.reduce((acc: number, ing: any) => {
      const cost = ing.inventoryItem.costPrice || 0;
      const quantity = ing.quantity || 0;
      const wastage = ing.wastagePercent || 0;
      return acc + (quantity * cost) / (1 - wastage / 100);
    }, 0);
  }, [recipe.ingredients]);

  const linkedItemName = recipe.menuItem?.name || recipe.tiffinItem?.name || "Unlinked";
  const linkedItemPrice = recipe.menuItem?.price || recipe.tiffinItem?.price || 0;
  const margin = linkedItemPrice > 0 ? ((linkedItemPrice - totalCost) / linkedItemPrice) * 100 : 0;

  return (
    <Card className="border-none bg-card/40 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] overflow-hidden group">
      <CardHeader className="p-8 pb-4 border-b border-border/50 bg-orange-500/5">
        <div className="flex justify-between items-start">
          <Badge className="bg-orange-500/10 text-orange-500 border-none font-black text-[9px] px-3 py-1 rounded-full uppercase">
            {recipe.ingredients.length} Ingredients
          </Badge>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-orange-500/10 text-orange-500" onClick={onEdit}>
              <ChefHat size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-red-500/10 text-red-500" onClick={onDelete}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        <CardTitle className="text-2xl font-black uppercase italic mt-4">{recipe.name}</CardTitle>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate">Linked to: {linkedItemName}</p>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-border">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Est. Cost</p>
            <p className="text-lg font-black">₹{totalCost.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-border">
            <p className="text-[10px] font-black uppercase text-muted-foreground">Margin</p>
            <p className={`text-lg font-black ${margin > 30 ? 'text-emerald-500' : margin > 15 ? 'text-amber-500' : 'text-red-500'}`}>
              {margin.toFixed(1)}%
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Key Ingredients</p>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.slice(0, 3).map((ing: any) => (
              <Badge key={ing.id} variant="outline" className="rounded-lg text-[10px] font-bold border-border/50">
                {ing.inventoryItem.name} ({ing.quantity}{ing.unit})
              </Badge>
            ))}
            {recipe.ingredients.length > 3 && (
              <Badge variant="outline" className="rounded-lg text-[10px] font-bold border-border/50">
                +{recipe.ingredients.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecipeForm({ 
  vendorId, 
  inventoryItems, 
  menuItems, 
  tiffinItems,
  initialData,
  onSuccess 
}: { 
  vendorId: string, 
  inventoryItems: any[], 
  menuItems: any[],
  tiffinItems: any[],
  initialData?: any,
  onSuccess: () => void 
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [instructions, setInstructions] = useState(initialData?.instructions || "");
  const [servings, setServings] = useState<number | "">(initialData?.servings || 1);
  const [menuItemId, setMenuItemId] = useState(initialData?.menuItemId || "");
  const [tiffinItemId, setTiffinItemId] = useState(initialData?.tiffinItemId || "");
  const [ingredients, setIngredients] = useState<any[]>(
    initialData?.ingredients.map((ing: any) => ({
      inventoryItemId: ing.inventoryItemId,
      quantity: ing.quantity,
      unit: ing.unit,
      wastagePercent: ing.wastagePercent,
      isOptional: ing.isOptional,
      name: ing.inventoryItem.name,
      costPrice: ing.inventoryItem.costPrice || 0
    })) || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInventory = useMemo(() => {
    return inventoryItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inventoryItems, searchQuery]);

  const addIngredient = (item: any) => {
    if (ingredients.find(ing => ing.inventoryItemId === item.id)) {
      toast.error("Ingredient already added");
      return;
    }
    setIngredients([...ingredients, {
      inventoryItemId: item.id,
      name: item.name,
      quantity: 1,
      unit: item.unit || "units",
      wastagePercent: 0,
      isOptional: false,
      costPrice: item.costPrice || 0
    }]);
    setSearchQuery("");
  };

  const removeIngredient = (index: number) => {
    const ni = [...ingredients];
    ni.splice(index, 1);
    setIngredients(ni);
  };

  const updateIngredient = (index: number, field: string, value: any) => {
    const ni = [...ingredients];
    ni[index][field] = value;
    setIngredients(ni);
  };

  const totalCost = useMemo(() => {
    return ingredients.reduce((acc: number, ing: any) => {
      const quantity = parseFloat(ing.quantity as string) || 0;
      const cost = parseFloat(ing.costPrice as string) || 0;
      const wastage = parseFloat(ing.wastagePercent as string) || 0;
      return acc + (quantity * cost) / (1 - wastage / 100);
    }, 0);
  }, [ingredients]);

  const handleSubmit = async () => {
    if (!name || ingredients.length === 0) {
      toast.error("Please provide a name and at least one ingredient.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        description,
        instructions,
        servings,
        menuItemId: menuItemId === "none" ? null : menuItemId,
        tiffinItemId: tiffinItemId === "none" ? null : tiffinItemId,
        ingredients
      };

      if (initialData) {
        await updateRecipe(initialData.id, payload);
        toast.success("Recipe updated!");
      } else {
        await createRecipe(vendorId, payload);
        toast.success("Recipe created!");
      }
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pt-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Recipe Identity</Label>
            <Input 
              placeholder="e.g. Signature Butter Chicken" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-950 border-none font-bold text-lg" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Base Servings</Label>
              <Input 
                type="number"
                value={servings === "" ? "" : servings} 
                onChange={e => {
                  const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                  setServings(val);
                }} 
                className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-950 border-none font-bold" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Link to Menu Item</Label>
              <Select value={menuItemId} onValueChange={setMenuItemId}>
                <SelectTrigger className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-950 border-none font-bold">
                  <SelectValue placeholder="Select Item" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="none">None</SelectItem>
                  {menuItems.map(item => (
                    <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Or Link to Tiffin Item</Label>
            <Select value={tiffinItemId} onValueChange={setTiffinItemId}>
              <SelectTrigger className="rounded-2xl h-14 bg-zinc-50 dark:bg-zinc-950 border-none font-bold">
                <SelectValue placeholder="Select Tiffin Item" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="none">None</SelectItem>
                {tiffinItems.map(item => (
                  <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cooking Protocol</Label>
            <textarea 
              placeholder="Step-by-step instructions..." 
              value={instructions} 
              onChange={e => setInstructions(e.target.value)} 
              className="w-full min-h-[150px] p-6 rounded-[2rem] bg-zinc-50 dark:bg-zinc-950 border-none font-medium resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20" 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-950 border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-xl font-black uppercase italic">Ingredient Log</h4>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Build your component list</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Total Cost / {servings} Sv</p>
                <p className="text-2xl font-black text-orange-500">₹{totalCost.toFixed(2)}</p>
              </div>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="Search inventory..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-12 rounded-xl h-12 bg-background border-border"
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 p-2 rounded-2xl bg-background border border-border shadow-2xl max-h-[300px] overflow-y-auto">
                  {filteredInventory.map(item => (
                    <div 
                      key={item.id} 
                      className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer flex justify-between items-center transition-colors"
                      onClick={() => addIngredient(item)}
                    >
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.sku}</p>
                      </div>
                      <Badge className="bg-orange-500/10 text-orange-500 border-none text-[10px]">₹{item.costPrice || 0}/{item.unit}</Badge>
                    </div>
                  ))}
                  {filteredInventory.length === 0 && (
                    <p className="p-4 text-center text-xs text-muted-foreground font-bold">No items found</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {ingredients.map((ing, idx) => (
                <div key={ing.inventoryItemId} className="p-4 rounded-2xl bg-background border border-border/50 group/row">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-black text-sm uppercase">{ing.name}</p>
                      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Base: ₹{ing.costPrice}/{ing.unit}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-red-500 hover:bg-red-500/10" onClick={() => removeIngredient(idx)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase text-muted-foreground">Qty</Label>
                      <Input 
                        type="number" 
                        value={ing.quantity === "" ? "" : ing.quantity} 
                        onChange={e => {
                          const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                          updateIngredient(idx, 'quantity', val);
                        }}
                        className="h-9 rounded-lg text-xs font-bold" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase text-muted-foreground">Unit</Label>
                      <Input 
                        value={ing.unit} 
                        onChange={e => updateIngredient(idx, 'unit', e.target.value)}
                        className="h-9 rounded-lg text-xs font-bold" 
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] font-black uppercase text-muted-foreground">Waste %</Label>
                      <Input 
                        type="number" 
                        value={ing.wastagePercent === "" ? "" : ing.wastagePercent} 
                        onChange={e => {
                          const val = e.target.value === "" ? "" : parseFloat(e.target.value);
                          updateIngredient(idx, 'wastagePercent', val);
                        }}
                        className="h-9 rounded-lg text-xs font-bold" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Checkbox 
                      id={`opt-${idx}`} 
                      checked={ing.isOptional} 
                      onCheckedChange={(val) => updateIngredient(idx, 'isOptional', !!val)} 
                    />
                    <Label htmlFor={`opt-${idx}`} className="text-[10px] font-bold uppercase tracking-widest cursor-pointer">Optional Component</Label>
                  </div>
                </div>
              ))}
              {ingredients.length === 0 && (
                <div className="py-10 text-center opacity-50">
                  <Package className="mx-auto mb-4 text-muted-foreground" size={40} />
                  <p className="text-xs font-black uppercase tracking-widest">Select ingredients to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Button 
        className="w-full h-16 rounded-[2rem] bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-[0.3em] shadow-2xl shadow-orange-500/30 transition-all" 
        onClick={handleSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : (initialData ? "Apply Refinements" : "Initialize Recipe")}
      </Button>
    </div>
  );
}
