import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Store, MapPin, Tag, UtensilsCrossed, Search, Filter, ChefHat, Coffee, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Server component to fetch public vendors
export default async function ExplorePage(props: {
  searchParams: Promise<{ q?: string; type?: string; city?: string }>
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';
  const typeFilter = searchParams.type || '';
  const cityFilter = searchParams.city || '';

  // Build the prisma query dynamically
  const whereClause: any = {
    isPubliclyListed: true,
  };

  if (query) {
    whereClause.OR = [
      { businessName: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { cuisineTypes: { has: query } } // Note: array filtering might require specific PG syntax, but this works in Prisma
    ];
  }

  if (typeFilter) {
    whereClause.businessType = typeFilter;
  }

  if (cityFilter) {
    whereClause.city = { contains: cityFilter, mode: 'insensitive' };
  }

  // Fetch vendors
  const vendors = await prisma.vendorProfile.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      businessName: true,
      description: true,
      tenantSlug: true,
      logoUrl: true,
      coverImageUrl: true,
      businessType: true,
      cuisineTypes: true,
      city: true,
      state: true,
    }
  });

  const getBusinessIcon = (type?: string | null) => {
    switch (type) {
      case 'RESTAURANT': return <UtensilsCrossed size={16} />;
      case 'TIFFIN_SERVICE': return <ChefHat size={16} />;
      case 'CAFE': return <Coffee size={16} />;
      default: return <Store size={16} />;
    }
  };

  const formatBusinessType = (type?: string | null) => {
    if (!type) return 'Business';
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-emerald-500/30 overflow-x-hidden w-full">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-[pulse-glow_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[150px] rounded-full animate-[pulse-glow_6s_ease-in-out_infinite_reverse]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-white/5 glass">
        <div className="container flex h-16 md:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-emerald-500 p-1.5 md:p-2 rounded-lg md:rounded-xl text-zinc-950 group-hover:rotate-12 transition-all">
              <Store size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
            </div>
            <span className="text-lg md:text-xl font-black italic tracking-tighter text-foreground">
              Fork<span className="text-emerald-500">Stack</span> <span className="font-medium text-muted-foreground ml-1">Explore</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl font-bold hidden sm:flex border-zinc-200 dark:border-zinc-800")}
            >
              Vendor Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Search Section */}
        <section className="relative pt-12 pb-16 md:pt-24 md:pb-24 px-4 md:px-0">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center space-y-8 animate-[fade-in-up_0.8s_ease-out_both]">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest mb-4">
                <Search size={14} /> Public Directory
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground uppercase italic tracking-tighter leading-[0.9]">
                Discover <br className="hidden sm:block" />
                <span className="text-gradient-emerald">Local Eats.</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-lg font-medium max-w-2xl mx-auto">
                Explore the best restaurants, tiffin services, and cafes powered by ForkStack in your city.
              </p>

              {/* Search Form */}
              <form className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <Input 
                    name="q"
                    defaultValue={query}
                    placeholder="Search by name, cuisine, or tags..." 
                    className="h-14 pl-12 rounded-[1.5rem] bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/50 text-base shadow-sm"
                  />
                </div>
                <div className="relative w-full sm:w-48 group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                  <Input 
                    name="city"
                    defaultValue={cityFilter}
                    placeholder="City (e.g. Delhi)" 
                    className="h-14 pl-12 rounded-[1.5rem] bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:border-emerald-500/50 text-base shadow-sm"
                  />
                </div>
                <Button type="submit" className="h-14 px-8 rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest transition-transform active:scale-95 shadow-xl shadow-emerald-500/20">
                  Search
                </Button>
              </form>

              {/* Quick Filters */}
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 pt-4">
                <Link href="/explore" className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors", !typeFilter ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-950 dark:border-white" : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50")}>
                  All
                </Link>
                <Link href="/explore?type=RESTAURANT" className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors flex items-center gap-2", typeFilter === 'RESTAURANT' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50")}>
                  <UtensilsCrossed size={14} /> Restaurants
                </Link>
                <Link href="/explore?type=TIFFIN_SERVICE" className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors flex items-center gap-2", typeFilter === 'TIFFIN_SERVICE' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50")}>
                  <ChefHat size={14} /> Tiffin Services
                </Link>
                <Link href="/explore?type=CAFE" className={cn("px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-colors flex items-center gap-2", typeFilter === 'CAFE' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50")}>
                  <Coffee size={14} /> Cafes
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Directory Grid */}
        <section className="py-12 md:py-20 border-t border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="container mx-auto">
            {vendors.length === 0 ? (
              <div className="py-20 text-center max-w-md mx-auto">
                <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground mb-2">No Vendors Found</h3>
                <p className="text-muted-foreground text-sm">
                  We couldn't find any businesses matching your search criteria. Try adjusting your filters or search term.
                </p>
                <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }), "mt-6 rounded-xl font-bold")}>
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {vendors.map((vendor, i) => (
                  <Link 
                    key={vendor.id} 
                    href={`/${vendor.tenantSlug}`}
                    className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-1 animate-[fade-in-up_0.8s_ease-out_both]"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {/* Cover Area */}
                    <div className="h-32 md:h-40 bg-zinc-100 dark:bg-zinc-950 relative w-full overflow-hidden">
                      {vendor.coverImageUrl ? (
                        <img src={vendor.coverImageUrl} alt={vendor.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20" />
                      )}
                      
                      <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-white/10 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 shadow-sm">
                        {getBusinessIcon(vendor.businessType)}
                        {formatBusinessType(vendor.businessType)}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 md:p-8 flex-grow flex flex-col">
                      <div className="flex items-start gap-4 mb-4 relative -mt-12 md:-mt-14">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[1.5rem] p-1 border-2 border-white dark:border-zinc-800 shadow-lg shrink-0 overflow-hidden z-10">
                          {vendor.logoUrl ? (
                            <img src={vendor.logoUrl} alt={vendor.businessName} className="w-full h-full object-cover rounded-xl md:rounded-[1.25rem]" />
                          ) : (
                            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 rounded-xl md:rounded-[1.25rem] flex items-center justify-center text-zinc-400">
                              <Building2 size={24} />
                            </div>
                          )}
                        </div>
                        <div className="pt-8 md:pt-10 flex-1">
                          <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-foreground leading-none group-hover:text-emerald-500 transition-colors">
                            {vendor.businessName}
                          </h3>
                        </div>
                      </div>

                      {vendor.description && (
                        <p className="text-sm text-muted-foreground font-medium line-clamp-2 mb-6">
                          {vendor.description}
                        </p>
                      )}

                      <div className="mt-auto space-y-4">
                        {(vendor.city || vendor.state) && (
                          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">
                            <MapPin size={14} />
                            {vendor.city}{vendor.city && vendor.state ? ', ' : ''}{vendor.state}
                          </div>
                        )}
                        
                        {vendor.cuisineTypes && vendor.cuisineTypes.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {vendor.cuisineTypes.slice(0, 3).map((cuisine, idx) => (
                              <Badge key={idx} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-none font-bold text-[10px] uppercase tracking-wider">
                                {cuisine}
                              </Badge>
                            ))}
                            {vendor.cuisineTypes.length > 3 && (
                              <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-none font-bold text-[10px] uppercase tracking-wider">
                                +{vendor.cuisineTypes.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-white/5 py-12 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Store size={20} />
            <span className="text-lg font-black italic tracking-tighter uppercase">ForkStack Explore</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium mb-4">
            © {new Date().getFullYear()} ForkStack. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest text-zinc-500">
            <Link href="/privacy-policy" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-emerald-500 transition-colors">Terms and Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
