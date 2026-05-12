"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { RiderStatus, TiffinDeliveryStatus } from "@prisma/client";

export async function getRiders(vendorId: string) {
  return await prisma.deliveryAgent.findMany({
    where: { vendorId },
    include: {
      assignments: {
        include: {
          delivery: {
            include: {
              subscription: {
                include: { customer: true }
              }
            }
          }
        }
      }
    }
  });
}

export async function createRider(vendorId: string, data: any) {
  const rider = await prisma.deliveryAgent.create({
    data: { ...data, vendorId }
  });
  revalidatePath("/vendor/tiffin/riders");
  return rider;
}

export async function updateRiderStatus(id: string, status: RiderStatus) {
  const rider = await prisma.deliveryAgent.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/vendor/tiffin/riders");
  return rider;
}

export async function assignRiderToDelivery(agentId: string, deliveryId: string) {
  const assignment = await prisma.deliveryAssignment.upsert({
    where: { deliveryId },
    update: { agentId, status: 'PENDING' },
    create: { agentId, deliveryId, status: 'PENDING' }
  });

  // Update delivery status
  await prisma.tiffinDelivery.update({
    where: { id: deliveryId },
    data: { status: 'OUT_FOR_DELIVERY' }
  });

  // Update rider status to ASSIGNED if they were available
  await prisma.deliveryAgent.update({
    where: { id: agentId },
    data: { status: 'ASSIGNED' }
  });

  revalidatePath("/vendor/tiffin/riders");
  revalidatePath("/vendor/tiffin/deliveries");
  return assignment;
}

export async function completeDelivery(assignmentId: string) {
  const assignment = await prisma.deliveryAssignment.update({
    where: { id: assignmentId },
    data: { 
      status: 'DELIVERED',
      deliveredAt: new Date()
    },
    include: {
      delivery: true,
      agent: true
    }
  });

  await prisma.tiffinDelivery.update({
    where: { id: assignment.deliveryId },
    data: { status: 'DELIVERED' }
  });

  // Update remaining meals
  await prisma.tiffinSubscription.update({
    where: { id: assignment.delivery.subscriptionId },
    data: {
      remainingMeals: { decrement: 1 }
    }
  });

  // Check if rider has more pending deliveries
  const pendingCount = await prisma.deliveryAssignment.count({
    where: { agentId: assignment.agentId, status: { in: ['PENDING', 'OUT_FOR_DELIVERY'] } }
  });

  if (pendingCount === 0) {
    await prisma.deliveryAgent.update({
      where: { id: assignment.agentId },
      data: { status: 'AVAILABLE' }
    });
  }

  revalidatePath("/vendor/tiffin/riders");
  return assignment;
}

export async function getUnassignedDeliveries(vendorId: string, date: Date) {
  return await prisma.tiffinDelivery.findMany({
    where: {
      subscription: { vendorId },
      date: {
        gte: new Date(date.setHours(0,0,0,0)),
        lte: new Date(date.setHours(23,59,59,999))
      },
      assignment: null,
      status: 'PENDING'
    },
    include: {
      subscription: {
        include: { customer: true }
      }
    }
  });
}
