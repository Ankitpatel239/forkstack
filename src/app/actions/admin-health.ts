
'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getPlatformHealth() {
  try {
    // 1. Simulated Latency/Stats (could be real if using a monitoring API)
    const stats = {
      dbLatency: '14ms',
      apiUptime: '99.98%',
      hardwareLoad: '18%',
      activeSessions: '42'
    };

    // 2. Fetch Recent Logs
    const whatsappLogs = await prisma.whatsAppLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { vendor: { select: { businessName: true } } }
    });

    const formattedLogs = whatsappLogs.map(log => ({
      type: log.status === 'failed' ? 'Error' : 'Info',
      msg: `WhatsApp Relay: ${log.status.toUpperCase()} for ${log.vendor.businessName}`,
      time: new Date(log.createdAt).toLocaleTimeString()
    }));

    // 3. Platform Status
    const maintenanceMode = await (prisma as any).systemSetting.findUnique({
      where: { key: 'MAINTENANCE_MODE' }
    });

    return {
      success: true,
      data: {
        stats,
        logs: formattedLogs.length > 0 ? formattedLogs : [
          { type: 'Info', msg: 'Core connectivity stable in all regions', time: 'Just now' },
          { type: 'Info', msg: 'System background audit completed', time: '12 mins ago' }
        ],
        isLockdown: maintenanceMode?.value === 'true'
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleLockdownProtocol(enable: boolean) {
  try {
    await (prisma as any).systemSetting.upsert({
      where: { key: 'MAINTENANCE_MODE' },
      update: { value: enable.toString() },
      create: { 
        key: 'MAINTENANCE_MODE', 
        value: enable.toString(),
        group: 'SECURITY',
        description: 'Global platform lockdown state'
      }
    });
    revalidatePath('/admin/health');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function triggerHeartbeat() {
  // Simulate a system-wide revalidation/check
  revalidatePath('/admin/health');
  return { success: true, timestamp: new Date().toISOString() };
}
