
import { prisma } from '@/lib/db';
import { ChefHat, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { BookingForm } from './BookingForm';

export default async function ReservationPage({ params }: { params: Promise<{ vendorSlug: string }> }) {
  const { vendorSlug } = await params;
  const vendor = await prisma.vendorProfile.findUnique({
    where: { tenantSlug: vendorSlug },
    include: {
      tables: {
        where: { isActive: true },
        orderBy: { tableNumber: 'asc' }
      }
    }
  });

  if (!vendor) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
         <h1 className="text-zinc-700 font-black uppercase tracking-[0.5em]">Node Not Found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-24 relative selection:bg-emerald-500/30">
      {/* Dynamic Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <Link 
          href={`/${vendorSlug}`}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group"
        >
          <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest italic">Back to Menu</span>
        </Link>

        <div className="space-y-8 mb-12">
           <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Calendar size={32} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-none">Book a Table</h1>
                <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                  <MapPin size={12} className="text-emerald-500" /> {vendor.businessName} • {vendor.address}
                </p>
              </div>
           </div>
           
           <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl">
             <p className="text-zinc-400 text-sm leading-relaxed italic">
               Reserve your spot for an exceptional dining experience. Choose your preferred date, time, and let us handle the rest.
             </p>
           </div>
        </div>

        <BookingForm vendorId={vendor.id} tables={vendor.tables} vendorSlug={vendorSlug} />
      </div>

      {/* Footer Info */}
      <div className="mt-20 py-12 border-t border-zinc-900 bg-zinc-950/50">
         <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center gap-6">
            <div className="h-12 w-12 rounded-[1.5rem] bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
               <ChefHat size={24} />
            </div>
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em]">
               Infrastructure by <span className="text-emerald-500/50 pointer-events-none">ForkStack Core</span>
            </p>
         </div>
      </div>
    </div>
  );
}
