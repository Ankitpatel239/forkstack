
'use client';

import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  Package, 
  History,
  TrendingUp,
  BarChart3,
  ArrowUpRight, 
  MoreVertical,
  Edit,
  Trash2,
  ChevronRight,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertCircle,
  MapPin,
  Building2,
  Layers,
  Clock,
  ArrowRight,
  Scan,
  Tag,
  RotateCcw,
  QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InventoryDialog } from './InventoryDialog';
import { CodeGeneratorDialog } from './CodeGeneratorDialog';
import { ItemAnalysisDialog } from './ItemAnalysisDialog';
import { GlobalAnalysisDialog } from './GlobalAnalysisDialog';
import { BulkTagDialog } from './BulkTagDialog';
import { archiveInventoryItem, deleteInventoryItem, getItemHistory } from '@/app/actions/inventory';
import { seedVendorInventory } from '@/app/actions/seed-inventory';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Link from 'next/link';

export default function InventoryClientPage({ initialItems }: { initialItems: any[] }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [historyItem, setHistoryItem] = useState<any>(null);
  const [analysisItem, setAnalysisItem] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isCodeGenOpen, setIsCodeGenOpen] = useState(false);
  const [codeGenItem, setCodeGenItem] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkPrintOpen, setIsBulkPrintOpen] = useState(false);
  const [isGlobalAnalysisOpen, setIsGlobalAnalysisOpen] = useState(false);

  const filteredItems = initialItems.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.sku?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase()) ||
    i.brand?.toLowerCase().includes(search.toLowerCase()) ||
    i.location?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const lowStockItems = initialItems.filter(i => i.quantity <= i.lowStockThreshold);

  const totalValuation = useMemo(() => {
    return initialItems.reduce((acc, item) => {
      const itemBatchValue = (item.batches || []).reduce((bAcc: number, b: any) => bAcc + (b.quantity * b.costPrice), 0);
      return acc + (itemBatchValue > 0 ? itemBatchValue : (item.costPrice || 0) * item.quantity);
    }, 0);
  }, [initialItems]);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedVendorInventory();
      toast.success(`Items added`);
    } catch (error) {
      toast.error('Seeding failed');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const showHistory = async (item: any) => {
    setHistoryItem(item);
    setIsLoadingHistory(true);
    try {
      const data = await getItemHistory(item.id);
      setHistoryData(data);
    } catch (error) {
      toast.error('Log error');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const showAnalysis = async (item: any) => {
    setAnalysisItem(item);
    setIsLoadingHistory(true);
    try {
      const data = await getItemHistory(item.id);
      setHistoryData(data);
    } catch (error) {
      toast.error('Data error');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(i => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getSelectedItems = () => {
    return initialItems.filter(i => selectedIds.includes(i.id));
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Retire asset?')) return;
    try {
      await archiveInventoryItem(id);
      toast.success('Asset retired');
    } catch (error) {
      toast.error('Error');
    }
  };

  return (
    <TooltipProvider>
    <div className="space-y-4 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Stock Portfolio</h1>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">FIFO Multi-Batch Catalog</p>
        </div>
        <div className="flex items-center gap-2">
           <Button 
             variant="outline"
             onClick={handleSeed}
             disabled={isSeeding}
             className="h-9 rounded-lg border-zinc-800 bg-transparent text-zinc-500 text-[10px] font-bold px-4 hover:bg-zinc-900"
           >
             <Layers className="w-3 h-3 mr-2" />
             Sample Data
           </Button>
           <Button 
             variant="outline"
             onClick={() => setIsGlobalAnalysisOpen(true)}
             className="h-9 rounded-lg border-zinc-800 bg-transparent text-zinc-500 text-[10px] font-black px-4 hover:bg-zinc-900"
           >
             <BarChart3 className="w-3 h-3 mr-2 text-emerald-500" />
             Strategic Intel
           </Button>
           <Link href="/vendor/inventory/sell">
             <Button 
               variant="outline"
               className="h-9 rounded-lg border-emerald-500/20 bg-emerald-500/5 text-emerald-500 font-bold px-4 hover:bg-emerald-500/10 text-[10px]"
             >
               <Scan className="w-3 h-3 mr-2" /> Quick Sell (POS)
             </Button>
           </Link>
           <Button 
             onClick={() => { setSelectedItem(null); setIsDialogOpen(true); }}
             className="h-9 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 shadow-lg text-[10px]"
           >
             <Plus className="w-3 h-3 mr-2" /> Add Asset
           </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 relative overflow-hidden group">
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Portfolio Valuation</p>
            <div className="flex items-baseline gap-2">
               <h3 className="text-lg font-black text-white">₹{totalValuation.toLocaleString('en-IN')}</h3>
               <span className="text-emerald-500 text-[8px] font-bold uppercase py-0.5 px-1 bg-emerald-500/10 rounded">FIFO Opt</span>
            </div>
         </div>

         <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 relative overflow-hidden">
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Reorder Warnings</p>
            <div className="flex items-baseline gap-2">
               <h3 className={`text-lg font-black ${lowStockItems.length > 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                 {lowStockItems.length} Items
               </h3>
            </div>
         </div>

         <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4 relative overflow-hidden">
            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mb-1">Batch Integrity</p>
            <div className="flex items-baseline gap-2">
               <h3 className="text-lg font-black text-emerald-500 uppercase tracking-tighter">Healthy</h3>
            </div>
         </div>
      </div>

      <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 h-10 w-full md:w-[400px] rounded-lg focus-within:border-emerald-500/30 transition-all">
        <Search size={14} className="text-zinc-600" />
        <input 
          type="text" 
          value={search}
          onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
          placeholder="Filter catalog..." 
          className="bg-transparent border-none focus:ring-0 text-xs font-medium flex-1 outline-none text-white tracking-tight" 
        />
      </div>

      <div className="bg-zinc-950/20 border border-zinc-900/50 rounded-xl overflow-hidden min-h-[500px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-zinc-950/80 text-[9px] uppercase font-black tracking-[0.15em] text-zinc-700 border-b border-zinc-900">
              <tr>
                <th className="px-5 py-3 w-10">
                   <Checkbox 
                     checked={selectedIds.length > 0 && selectedIds.length === currentItems.length}
                     onCheckedChange={toggleSelectAll}
                     className="border-zinc-800 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-zinc-950"
                   />
                </th>
                <th className="px-5 py-3">Product Profile</th>
                <th className="px-5 py-3">Classification</th>
                <th className="px-5 py-3">In-Stock Analysis</th>
                <th className="px-5 py-3">Valuation (Cost)</th>
                <th className="px-5 py-3 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {currentItems.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-zinc-800 font-bold uppercase text-[10px]">Empty Catalog</td></tr>
              ) : (
                currentItems.map((item) => {
                  const activeBatches = item.batches?.filter((b: any) => !b.isSoldOut && b.quantity > 0)
                    .sort((a: any, b: any) => new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime());
                  const itemValuation = (activeBatches || []).reduce((acc: number, b: any) => acc + (b.quantity * b.costPrice), 0);

                  return (
                    <tr key={item.id} className={`hover:bg-zinc-900/30 transition-all border-b border-zinc-900/20 group ${selectedIds.includes(item.id) ? 'bg-emerald-500/5' : ''}`}>
                      <td className="px-5 py-2.5">
                         <Checkbox 
                           checked={selectedIds.includes(item.id)}
                           onCheckedChange={() => toggleSelectOne(item.id)}
                           className="border-zinc-800 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-zinc-950"
                         />
                      </td>
                      <td className="px-5 py-2.5">
                         <div className="space-y-0.5">
                            <p className="font-bold text-zinc-300 group-hover:text-emerald-400 transition-colors uppercase text-[11px] tracking-tight">{item.name}</p>
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] text-zinc-600 font-bold">#{item.sku}</span>
                               {item.brand && <span className="text-[9px] text-zinc-700 font-bold">• {item.brand}</span>}
                            </div>
                         </div>
                      </td>
                      <td className="px-5 py-2.5">
                         <div className="space-y-0.5">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{item.category}</span>
                            {item.location && <p className="text-[9px] text-zinc-700 font-medium italic">{item.location}</p>}
                         </div>
                      </td>
                      <td className="px-5 py-2.5">
                         <div className="space-y-1.5 min-w-[140px]">
                            <div className="flex items-center justify-between text-[10px] font-black italic">
                               <span className={item.quantity <= item.lowStockThreshold ? 'text-red-500' : 'text-zinc-200'}>
                                  {item.quantity} {item.unit}
                               </span>
                               {item.quantity <= item.lowStockThreshold && <span className="text-[8px] text-red-500 tracking-tighter uppercase px-1 bg-red-500/10 rounded">Low</span>}
                            </div>
                            <div className="flex items-center gap-0.5 h-1 bg-zinc-900 rounded-full overflow-hidden">
                               {activeBatches?.map((batch: any, bIdx: number) => (
                                  <Tooltip key={batch.id}>
                                     <TooltipTrigger asChild>
                                        <div 
                                          className={`h-full cursor-help ${bIdx === 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-zinc-700'}`}
                                          style={{ width: `${(batch.quantity / Math.max(1, item.quantity)) * 100}%` }}
                                        />
                                     </TooltipTrigger>
                                     <TooltipContent className="bg-black border-zinc-800 text-[9px] p-2">
                                        <p className="font-bold">{batch.quantity} @ ₹{batch.costPrice}</p>
                                        {bIdx === 0 && <p className="text-emerald-400 font-black text-[7px] uppercase mt-1">FIFO Priority</p>}
                                     </TooltipContent>
                                  </Tooltip>
                               ))}
                            </div>
                            {activeBatches && activeBatches.length > 0 && (
                               <div className="flex items-center gap-1.5 mt-1.5 animate-in fade-in duration-700">
                                  <div className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                                     <p className="text-[7px] font-black uppercase text-emerald-500 tracking-tighter flex items-center gap-1">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                        FIFO: {activeBatches[0].quantity} {item.unit}
                                     </p>
                                  </div>
                                  {activeBatches.length > 1 && (
                                     <span className="text-[7px] font-bold text-zinc-700 uppercase">+{activeBatches.length - 1} Batches</span>
                                  )}
                               </div>
                            )}
                         </div>
                      </td>
                      <td className="px-5 py-2.5">
                         <div className="space-y-0.5">
                           <p className="font-bold text-zinc-200 text-[11px]">₹{(itemValuation || (item.costPrice * item.quantity)).toLocaleString('en-IN')}</p>
                           <p className="text-[8px] text-zinc-700 font-black uppercase tracking-tighter">Lot Avg: ₹{(item.costPrice || 0).toLocaleString('en-IN')}</p>
                         </div>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <button className="h-7 w-7 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-zinc-700 transition-all ml-auto">
                                  <MoreVertical size={14} />
                               </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-950 border-zinc-900 text-white w-48 rounded-xl shadow-2xl p-1">
                               <DropdownMenuItem onClick={() => handleEdit(item)} className="cursor-pointer text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-emerald-500 focus:text-zinc-950">
                                  <Edit className="w-3.5 h-3.5 mr-2" /> Replenish & Audit
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => showAnalysis(item)} className="cursor-pointer text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-emerald-500 focus:text-zinc-950">
                                  <BarChart3 className="w-3.5 h-3.5 mr-2" /> Performance Intel
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => showHistory(item)} className="cursor-pointer text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-zinc-900">
                                  <History className="w-3.5 h-3.5 mr-2 text-zinc-600" /> Logs
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => { setCodeGenItem(item); setIsCodeGenOpen(true); }} className="cursor-pointer text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-zinc-900">
                                  <QrCode className="w-3.5 h-3.5 mr-2 text-zinc-600" /> Generate Physical Tag
                               </DropdownMenuItem>
                               <DropdownMenuSeparator className="bg-zinc-900 mx-1" />
                               <DropdownMenuItem onClick={() => handleArchive(item.id)} className="cursor-pointer text-red-500 text-[10px] font-bold py-2 px-3 rounded-lg focus:bg-red-500/10">
                                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Retire Asset
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="bg-zinc-950/80 border-t border-zinc-900 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                Node {currentPage} <span className="text-zinc-800 mx-1">/</span> {totalPages || 1}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-6 w-6 rounded-md text-[9px] font-black transition-all ${
                        currentPage === pageNum 
                        ? 'bg-emerald-500 text-zinc-950' 
                        : 'bg-zinc-900 text-zinc-600 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="h-8 border-zinc-800 bg-transparent text-zinc-500 text-[9px] font-bold px-3 hover:bg-zinc-900"
              >
                Prev
              </Button>
              <Button
                variant="outline"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="h-8 border-zinc-800 bg-transparent text-zinc-500 text-[9px] font-bold px-3 hover:bg-zinc-900"
              >
                Next
              </Button>
            </div>
        </div>
      </div>

      <Sheet open={!!historyItem} onOpenChange={(open) => { if (!open) { setHistoryItem(null); setHistoryData([]); } }}>
        <SheetContent className="bg-black border-zinc-900 text-white sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-6 border-b border-zinc-900 bg-zinc-950 shrink-0">
            <SheetTitle className="text-lg font-black italic tracking-tighter">Audit Trail</SheetTitle>
            <SheetDescription className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.2em]">
              {historyItem?.name}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-emerald-500 h-4 w-4" /></div>
            ) : (
              <div className="space-y-6 relative border-l border-zinc-900 ml-2 pl-6">
                {historyData.map((log) => (
                  <div key={log.id} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-800 border-2 border-black z-10" />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[8px] font-bold uppercase text-zinc-600">
                        <span>{log.type}</span>
                        <span>{format(new Date(log.createdAt), 'dd MMM')}</span>
                      </div>
                      <p className="text-sm font-black italic text-zinc-100">{log.quantity > 0 ? '+' : ''}{log.quantity} {historyItem?.unit}</p>
                      <p className="text-[10px] text-zinc-500 italic">"{log.reason}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <InventoryDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
      />

      <CodeGeneratorDialog 
        open={isCodeGenOpen}
        onOpenChange={setIsCodeGenOpen}
        item={codeGenItem}
      />

      <ItemAnalysisDialog 
        open={!!analysisItem}
        onOpenChange={(open) => !open && setAnalysisItem(null)}
        item={analysisItem}
        history={historyData}
      />

      <GlobalAnalysisDialog 
        open={isGlobalAnalysisOpen}
        onOpenChange={setIsGlobalAnalysisOpen}
      />

      <BulkTagDialog 
        open={isBulkPrintOpen}
        onOpenChange={setIsBulkPrintOpen}
        items={getSelectedItems()}
      />

      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-500">
           <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-2 flex items-center gap-4 min-w-[300px] border-emerald-500/20 bg-gradient-to-tr from-zinc-950 to-zinc-900/50 backdrop-blur-xl">
              <div className="flex flex-col px-4 border-r border-zinc-900">
                 <span className="text-[10px] font-black italic text-emerald-500">{selectedIds.length} Assets</span>
                 <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Selection Active</span>
              </div>
              <div className="flex items-center gap-2 pr-2">
                 <Button 
                   onClick={() => setIsBulkPrintOpen(true)}
                   className="h-10 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-emerald-500/10"
                 >
                    <Tag className="w-3.5 h-3.5 mr-2" /> Print Bulk Tags
                 </Button>
                 <Button 
                   variant="ghost"
                   onClick={() => setSelectedIds([])}
                   className="h-10 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                 >
                    Clear
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
