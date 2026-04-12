import { encrypt, decrypt } from './encryption';

export async function assertVendorAccess(userId: string, vendorId: string, isAdmin: boolean = false) {
  // In real implementation this checks Prisma for UserVendorAssignment
  // const assignment = await prisma.userVendorAssignment.findUnique({
  //   where: { userId_vendorId: { userId, vendorId } }
  // });
  // if (!assignment && !isAdmin) throw new Error('Access denied');
  return true;
}
