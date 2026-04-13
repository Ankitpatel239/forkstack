
export interface MenuItemMedia {
  id?: string;
  menuItemId?: string;
  url: string;
  alt?: string | null;
  caption?: string | null;
  isMain: boolean;
  sortOrder?: number;
  createdAt?: Date;
  delete?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string | null;
  category?: MenuCategory | null;
  description: string | null;
  imageUrl: string | null;
  isAvailable: boolean;
  preparationTime?: number | null;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fats?: number | null;
  isVegan?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isHalal?: boolean;
  spiciness?: number;
  allergens?: string[];
  ingredients?: string[];
  costPrice?: number | null;
  taxRate?: number | null;
  popularity?: number;
  vendorId?: string;
  media?: MenuItemMedia[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuCategory {
  id: string;
  vendorId: string;
  name: string;
  parentId: string | null;
  sortOrder: number;
  children?: MenuCategory[];
  createdAt: Date;
  updatedAt: Date;
}
