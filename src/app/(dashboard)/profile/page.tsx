import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Shield,
  Store,
  Globe,
  MapPin,
  ExternalLink,
  Edit,
  Sliders,
  Sparkles,
  Zap,
  Lock,
  ArrowRight,
  TrendingUp,
  Package,
  Layers,
  Activity,
  Key
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Profile | ForkStack',
  description: 'Your ForkStack account credentials and system profile nodes.',
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  // Fetch full user details from backend
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      ownedVendor: true,
      _count: {
        select: {
          tiffinSubscriptions: true,
          attendance: true
        }
      }
    }
  });

  if (!user) {
    redirect('/login');
  }

  // If ADMIN, fetch some system statistics to show off a premium interface
  let systemStats = null;
  if (user.role === 'ADMIN') {
    const [vendorCount, userCount, activePlans] = await Promise.all([
      prisma.vendorProfile.count(),
      prisma.user.count(),
      prisma.platformPlan?.count() || Promise.resolve(0)
    ]);
    systemStats = { vendorCount, userCount, activePlans };
  }

  const joinDateFormatted = new Date(user.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const initials = (user.name || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      {/* Visual Accent Glows */}
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-emerald-500/5 blur-[80px] -z-10" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] -z-10" />

      {/* Profile Header Block */}
      <div className="relative rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl p-6 md:p-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10">
          <div className="relative group shrink-0">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20 outline outline-4 outline-white dark:outline-zinc-900 ring-1 ring-zinc-100 dark:ring-zinc-800">
              <span className="font-black text-zinc-900 dark:text-zinc-950 text-3xl md:text-5xl tracking-tighter">{initials}</span>
            </div>
            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-emerald-500">
              <Sparkles size={16} className="animate-pulse" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
              <h1 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-white italic uppercase tracking-tighter">{user.name || 'Anonymous User'}</h1>
              <span className="self-center inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {user.role}
              </span>
            </div>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 break-all sm:break-normal text-center sm:text-left">
              <Mail size={14} className="text-emerald-500 shrink-0" /> <span>{user.email}</span>
            </p>
            <p className="text-[10px] md:text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
              Security Node Registered Since {joinDateFormatted}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-center">
            <Link
              href={user.role === 'ADMIN' ? '/admin/settings' : '/vendor/settings'}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all font-black text-[10px] uppercase tracking-widest"
            >
              <Edit size={14} /> Update Info
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Hand: Credentials & Identity Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20">
              <h3 className="text-sm font-black text-zinc-900 dark:text-white italic uppercase tracking-widest flex items-center gap-2">
                <Shield size={16} className="text-emerald-500" /> Account Security Credentials
              </h3>
            </div>

            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 px-4 py-3 rounded-xl">
                  {user.name || 'Not Provided'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Linked Email Address</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 px-4 py-3 rounded-xl flex items-center justify-between gap-3">
                  <span className="truncate">{user.email}</span>
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-600 dark:text-emerald-500 bg-emerald-500/5 text-[9px] font-bold uppercase py-0.5 px-2 shrink-0">Verified</Badge>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Contact Vector (Phone)</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 px-4 py-3 rounded-xl flex items-center gap-2">
                  <Phone size={14} className="text-zinc-500 dark:text-zinc-600" />
                  <span>{user.phone || 'No phone registered'}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Authorized Role</span>
                <p className="text-sm font-bold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 px-4 py-3 rounded-xl flex items-center gap-2">
                  <Key size={14} className="text-emerald-500" />
                  <span className="font-black italic uppercase text-emerald-600 dark:text-emerald-400">{user.role}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Integration Status</span>
                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 px-4 py-3 rounded-xl">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Active & Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hand: Context-Specific System Workspaces */}
        <div className="md:col-span-7 space-y-6">
          {/* Admin Context Workspace */}
          {user.role === 'ADMIN' && systemStats && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl space-y-6">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 flex items-center justify-between">
                <h3 className="text-sm font-black text-zinc-900 dark:text-white italic uppercase tracking-widest flex items-center gap-2">
                  <Sliders size={16} className="text-emerald-500" /> Platform Command Engine
                </h3>
                <span className="text-[9px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded">Superuser Node</span>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Live Partners</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-500 italic">{systemStats.vendorCount}</p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Users</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-white italic">{systemStats.userCount}</p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Config Tiers</p>
                    <p className="text-2xl font-black text-zinc-900 dark:text-white italic">{systemStats.activePlans}</p>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Activity size={12} className="text-orange-500" /> Administrative Access Granted
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    You have complete master control over user records, vendor profiles, platform automation scripts, cron jobs, and subscription plans.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href="/admin/dashboard"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500 text-white dark:text-zinc-950 hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/10"
                  >
                    Platform Command <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/admin/vendors"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all font-black text-xs uppercase tracking-widest"
                  >
                    Partner Registry
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Owner Context Workspace */}
          {user.role === 'VENDOR_OWNER' && (
            <div className="space-y-6">
              {user.ownedVendor ? (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 flex items-center justify-between">
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white italic uppercase tracking-widest flex items-center gap-2">
                      <Store size={16} className="text-emerald-500" /> Associated Vendor Profile
                    </h3>
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      {user.ownedVendor.subscriptionPlan} Plan
                    </span>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80">
                      {user.ownedVendor.logoUrl ? (
                        <img
                          src={user.ownedVendor.logoUrl}
                          alt="Vendor Logo"
                          className="h-16 w-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-800"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-emerald-500 shrink-0">
                          <Store size={24} />
                        </div>
                      )}
                      <div className="text-center sm:text-left flex-1">
                        <h4 className="text-lg font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none">{user.ownedVendor.businessName}</h4>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5 flex items-center justify-center sm:justify-start gap-1">
                          <Globe size={12} className="text-zinc-400 dark:text-zinc-600" /> forkstack.com/{user.ownedVendor.tenantSlug}
                        </p>
                      </div>
                      <Link
                        href={`/vendor/settings/identity`}
                        className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-2 rounded-xl transition-all"
                        title="Edit Business Identity"
                      >
                        <Edit size={16} />
                      </Link>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-1">
                        <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-600 uppercase tracking-widest">Business Hotline</span>
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                          <Phone size={12} className="text-emerald-500" /> {user.ownedVendor.businessPhone || 'No business phone'}
                        </p>
                      </div>

                      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-1">
                        <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-600 uppercase tracking-widest">Business Email</span>
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                          <Mail size={12} className="text-emerald-500 shrink-0" /> <span className="truncate">{user.ownedVendor.businessEmail || 'No business email'}</span>
                        </p>
                      </div>
                    </div>

                    {user.ownedVendor.address && (
                      <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-1">
                        <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                          <MapPin size={10} /> Physical Coordinates
                        </span>
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {user.ownedVendor.address}
                        </p>
                      </div>
                    )}

                    <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                          <Zap size={12} className="text-emerald-500 animate-bounce" /> Subscription Status
                        </h4>
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          {user.ownedVendor.subscriptionStatus}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                        Your vendor account subscription is scheduled to run through <strong>{new Date(user.ownedVendor.subscriptionEnd).toLocaleDateString()}</strong>.
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Link
                        href="/vendor/dashboard"
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500 text-white dark:text-zinc-950 hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/10"
                      >
                        Enter Shop Dashboard <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 text-center space-y-6">
                  <div className="h-16 w-16 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mx-auto">
                    <Store size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">No Vendor Profile Synced</h3>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                      You are authenticated as a Vendor Owner, but no store profile has been bound to your user record.
                    </p>
                  </div>
                  <Link
                    href="/vendor/settings/identity"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white dark:text-zinc-950 hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-all font-black text-xs uppercase tracking-widest"
                  >
                    Bind Store Info
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* General Team Member / Customer context */}
          {user.role !== 'ADMIN' && user.role !== 'VENDOR_OWNER' && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 text-center space-y-6">
              <div className="h-16 w-16 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mx-auto">
                <UserIcon size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter">Standard Access Workspace</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  Welcome to ForkStack. Your user account does not possess higher platform manager/owner nodes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
