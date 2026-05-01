import { TiffinSubscriptionStatus, User } from "@prisma/client";

export const TiffinMealType = {
  BREAKFAST: "BREAKFAST",
  LUNCH: "LUNCH",
  DINNER: "DINNER",
  BOTH: "BOTH"
} as const;

export type TiffinMealType = (typeof TiffinMealType)[keyof typeof TiffinMealType];

export interface TiffinPlan {
  id: string;
  vendorId: string;
  name: string;
  description: string | null;
  price: number;
  mealCount: number;
  mealType: TiffinMealType;
  validityDays: number;
  inclusions: string[];
  
  // Advanced fields
  timeSlot?: string | null;
  areas: string[];
  deliveryRadiusKm?: number | null;
  customStartAllowed: boolean;
  pauseAllowed: boolean;
  maxSkips: number;
  dietType?: string | null;
  spiceLevel?: string | null;
  weeklyMenu?: any;
  paymentType: string;
  autoRenew: boolean;
  maxSubscribers?: number | null;
  tags: string[];

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TiffinSubscription {
  id: string;
  vendorId: string;
  customerId: string;
  planId: string;
  status: TiffinSubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  remainingMeals: number;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  
  // Snapshots
  planNameSnapshot: string | null;
  planPriceSnapshot: number | null;
  inclusionsSnapshot: string[];
  timeSlotSnapshot?: string | null;
  dietTypeSnapshot?: string | null;
  spiceLevelSnapshot?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionWithDetails = TiffinSubscription & {
  customer: User;
  plan: TiffinPlan;
};
