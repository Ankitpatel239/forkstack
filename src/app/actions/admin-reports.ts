
'use server';

import { prisma } from '@/lib/db';
import { startOfMonth, subMonths, format } from 'date-fns';

export async function getPlatformReports() {
  try {
    // 1. Fetch Plan Distribution
    const vendors = await prisma.vendorProfile.findMany({
      select: { subscriptionPlan: true }
    });
    
    const distribution: Record<string, number> = { total: vendors.length };
    vendors.forEach(v => {
      distribution[v.subscriptionPlan] = (distribution[v.subscriptionPlan] || 0) + 1;
    });

    // 2. Fetch Revenue Streams (simplified)
    const subscriptionRevenue = await prisma.subscriptionPayment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true }
    });

    const orderRevenue = await prisma.order.aggregate({
      where: { paymentStatus: 'COMPLETED' },
      _sum: { totalAmount: true }
    });

    // 3. Monthly Revenue (Last 12 Months)
    const monthlyData = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = startOfMonth(subMonths(new Date(), i - 1));

      const monthRevenue = await prisma.subscriptionPayment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: monthStart,
            lt: monthEnd
          }
        },
        _sum: { amount: true }
      });

      monthlyData.push({
        month: format(monthStart, 'MMM'),
        value: monthRevenue._sum.amount || 0
      });
    }

    // 4. Recent Transactions
    const recentTransactions = await prisma.subscriptionPayment.findMany({
      where: { status: 'COMPLETED' },
      include: { vendor: { select: { businessName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return {
      success: true,
      data: {
        distribution,
        revenue: {
          subscriptions: subscriptionRevenue._sum.amount || 0,
          orders: orderRevenue._sum.amount || 0,
          platformFees: (orderRevenue._sum.amount || 0) * 0.05 // Example 5% fee
        },
        monthlyData,
        recentTransactions
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
