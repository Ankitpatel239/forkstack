// Temporary type definitions until 'npx prisma generate' is run
import { User } from "@prisma/client";

export enum TiffinMealType {
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  BOTH = "BOTH",
}

export enum TiffinSubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  PAUSED = "PAUSED",
  CANCELLED = "CANCELLED",
}

export interface TiffinPlan {
  id: string;
  vendorId: string;
  name: string;
  description: string | null;
  price: number;
  mealCount: number;
  mealType: TiffinMealType;
  validityDays: number;
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
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionWithDetails = TiffinSubscription & {
  customer: User;
  plan: TiffinPlan;
};
