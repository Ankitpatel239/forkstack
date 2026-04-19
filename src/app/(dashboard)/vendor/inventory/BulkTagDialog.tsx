
'use client';

import { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Printer, 
  QrCode, 
  Barcode as BarcodeIcon, 
  X,
  Info
} from 'lucide-react';

interface BulkTagDialogProps {
  items: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BulkTagDialog({ items, open, onOpenChange }: BulkTagDialogProps) {
  const [tagType, setTagType] = useState<'BARCODE' | 'QR'>('QR');
  const [isPreparing, setIsPreparing] = useState(false);
  
  const handlePrint = async () => {
    setIsPreparing(true);
    
    // 1. Get the content
    const printableArea = document.getElementById('printable-area-container');
    if (!printableArea) return;

    // 2. Wait for images to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Create a temporary print host at the ROOT of the document
    const printHost = document.createElement('div');
    printHost.id = 'print-host-root';
    printHost.innerHTML = printableArea.innerHTML;
    document.body.appendChild(printHost);

    // 4. Trigger print
    window.print();

    // 5. Cleanup
    document.body.removeChild(printHost);
    setIsPreparing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[1000px] max-h-[90vh] p-0 overflow-hidden flex flex-col rounded-[2rem] shadow-2xl outline-none">


        <DialogHeader className="p-8 pb-4 bg-muted/30 border-b border-border no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Printer size={24} />
               </div>
               <div>
                 <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-foreground">Bulk Tag Factory</DialogTitle>
                 <DialogDescription className="text-muted-foreground/60 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                   Preparing {items.length} assets for physical cataloging
                 </DialogDescription>
               </div>
            </div>
            <div className="flex bg-muted p-1 rounded-xl gap-1 border border-border/50">
               <button 
                 onClick={() => setTagType('BARCODE')}
                 className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${tagType === 'BARCODE' ? 'bg-emerald-500 text-foreground shadow-lg' : 'text-muted-foreground/40 hover:text-foreground'}`}
               >
                 Barcode
               </button>
               <button 
                 onClick={() => setTagType('QR')}
                 className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${tagType === 'QR' ? 'bg-emerald-500 text-foreground shadow-lg' : 'text-muted-foreground/40 hover:text-foreground'}`}
               >
                 QR Code
               </button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-8 bg-background custom-scrollbar no-print">
          <div id="printable-area-container">
            {/* Style for printing only - moved here to ensure it's cloned */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                body > *:not(#print-host-root) {
                  display: none !important;
                }
                
                #print-host-root {
                  display: block !important;
                  width: 100% !important;
                  padding: 10mm !important;
                  background: white !important;
                }

                #printable-area {
                  display: flex !important;
                  flex-wrap: wrap !important;
                  justify-content: flex-start !important;
                  gap: 10mm !important;
                  width: 100% !important;
                }

                .print-tag {
                  width: calc(50% - 10mm) !important;
                  height: 85mm !important;
                  border: 0.1pt solid #aaa !important;
                  margin-bottom: 5mm !important;
                  font-family: Inter, system-ui, sans-serif !important;
                  page-break-inside: avoid !important;
                  display: flex !important;
                  flex-direction: column !important;
                  align-items: center !important;
                  justify-content: space-between !important;
                  padding: 5mm !important;
                  background: white !important;
                  color: black !important;
                  box-sizing: border-box !important;
                }

                img {
                  max-height: 45mm !important;
                  max-width: 90% !important;
                  margin: auto !important;
                }

                .no-print { display: none !important; }
                h3 { font-size: 16pt !important; margin: 0 !important; font-weight: 900 !important; }
                p { font-size: 10pt !important; margin: 0 !important; font-weight: bold !important; color: #666 !important; }
                span { font-size: 12pt !important; font-weight: 900 !important; color: #10b981 !important; }
              }
            `}} />

            <div id="printable-area" className="grid grid-cols-2 gap-4">
               {items.map((item: any) => (
                 <div key={item.id} className="print-tag bg-card text-foreground p-4 rounded-2xl border border-border/50 shadow-sm flex flex-col items-center gap-3 relative overflow-hidden min-h-[250px] justify-between text-center">
                    {/* Design Header */}
                    <div className="w-full">
                       <h3 className="text-[12px] font-black uppercase tracking-tighter line-clamp-1 text-foreground">{item.name}</h3>
                       <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5">SKU: {item.sku || 'N/A'}</p>
                    </div>

                    {/* Code Section */}
                    <div className="flex-1 flex items-center justify-center w-full">
                       <img 
                         src={`https://bwipjs-api.metafloor.com/?bcid=${tagType === 'BARCODE' ? 'code128' : 'qrcode'}&text=${encodeURIComponent(tagType === 'QR' ? `ITEM: ${item.name}\nSKU: ${item.sku}\nLOC: ${item.location}\nID: ${item.id}` : (item.barcode || item.sku || item.id))}&scale=3&rotate=N&includetext=${tagType === 'BARCODE'}`}
                         alt={item.sku}
                         className={tagType === 'QR' ? 'w-24 h-24' : 'w-full h-16 object-contain'}
                       />
                    </div>

                    {/* Location/Footer */}
                    <div className="w-full border-t border-border/50 pt-2 mt-auto">
                       <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">LOC: {item.location || 'UNSPECIFIED'}</span>
                    </div>

                    {/* Corner Accents for screen aesthetics */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-500/10 no-print" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-500/10 no-print" />
                 </div>
               ))}
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 bg-muted/30 border-t border-border no-print">
           <Button 
             variant="ghost" 
             onClick={() => onOpenChange(false)}
             className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground"
           >
             Close
           </Button>
           <Button 
             onClick={handlePrint}
             disabled={isPreparing}
             className="bg-emerald-500 hover:bg-emerald-400 text-foreground font-black uppercase tracking-widest text-[10px] h-14 px-10 rounded-2xl shadow-xl shadow-emerald-500/10 transition-all active:scale-95 ml-auto flex items-center gap-3"
           >
             {isPreparing ? (
               <>Preparing Assets...</>
             ) : (
               <><Printer size={18} /> Print {items.length} Tags</>
             )}
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
