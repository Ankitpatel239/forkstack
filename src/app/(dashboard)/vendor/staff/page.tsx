
import { prisma } from '@/lib/db';
import { requireVendor } from '@/lib/vendor';
import { 
  Users, 
  Clock, 
  Calendar, 
  Banknote, 
  UserPlus, 
  ArrowUpRight,
  UserCheck,
  UserMinus,
  Timer
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StaffClientPage } from '@/app/(dashboard)/vendor/staff/StaffClientPage';

export default async function WorkforcePage() {
  const vendor = await requireVendor();

  // Fetch staff assigned to this vendor
  const staff = await prisma.userVendorAssignment.findMany({
    where: { vendorId: vendor.id },
    include: {
      user: true
    }
  });

  // Fetch today's attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findMany({
    where: {
      userId: { in: staff.map((s: any) => s.userId) },
      date: { gte: today }
    }
  });

  // Fetch recent salary records
  const salaries = await prisma.salaryRecord.findMany({
    where: {
      userId: { in: staff.map((s: any) => s.userId) }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="space-y-10 pb-20">
      <StaffClientPage 
        staff={staff} 
        attendance={attendance} 
        salaries={salaries} 
      />
    </div>
  );
}
