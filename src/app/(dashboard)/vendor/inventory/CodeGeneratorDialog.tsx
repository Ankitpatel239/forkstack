
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Loader2, 
  QrCode, 
  Barcode as BarcodeIcon, 
  Download,
  Check,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

interface CodeGeneratorDialogProps {
  item: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CodeGeneratorDialog({ item, open, onOpenChange }: CodeGeneratorDialogProps) {
  const [type, setType] = useState<'BARCODE' | 'QR'>('BARCODE');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (open && item) {
      generateCode();
    }
  }, [open, type, item]);

  const generateCode = async () => {
    if (!item || !canvasRef.current) return;
    setIsGenerating(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set fixed dimensions for high resolution
    canvas.width = 600;
    canvas.height = 400;

    // Fill white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const textToEncode = type === 'QR' 
      ? `ITEM: ${item.name}\nSKU: ${item.sku || 'N/A'}\nLOC: ${item.location || 'N/A'}\nID: ${item.id}`
      : (item.barcode || item.sku || item.id);
    const bcid = type === 'BARCODE' ? 'code128' : 'qrcode';
    
    try {
      // Use bwip-js online API to get the base64 image of the code
      const response = await fetch(`https://bwipjs-api.metafloor.com/?bcid=${bcid}&text=${encodeURIComponent(textToEncode)}&scale=4&rotate=N&includetext=${type === 'BARCODE'}`);
      const blob = await response.blob();
      const img = new Image();
      
      img.onload = () => {
        // Draw the code image centered
        const codeSize = type === 'BARCODE' ? { w: 450, h: 150 } : { w: 200, h: 200 };
        const x = (canvas.width - codeSize.w) / 2;
        const y = 80;
        ctx.drawImage(img, x, y, codeSize.w, codeSize.h);

        // Header Style
        ctx.fillStyle = '#09090b'; // Zinc 950
        ctx.textAlign = 'center';
        
        // Item Name
        ctx.font = 'bold 24px Inter, system-ui, sans-serif';
        ctx.fillText(item.name.toUpperCase(), canvas.width / 2, 50);

        // Metadata Style
        ctx.font = 'italic 16px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#71717a'; // Zinc 500
        ctx.fillText(`SKU: ${item.sku || 'N/A'}`, canvas.width / 2, 75);

        // Footer / Location
        ctx.font = 'bold 18px Inter, system-ui, sans-serif';
        ctx.fillStyle = '#10b981'; // Emerald 500
        ctx.fillText(`LOCATION: ${item.location || 'UNSPECIFIED'}`, canvas.width / 2, canvas.height - 40);

        // Corner Decorations (Aesthetic)
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        const margin = 15;
        // Top-left
        ctx.beginPath(); ctx.moveTo(margin, margin + 40); ctx.lineTo(margin, margin); ctx.lineTo(margin + 40, margin); ctx.stroke();
        // Bottom-right
        ctx.beginPath(); ctx.moveTo(canvas.width - margin, canvas.height - margin - 40); ctx.lineTo(canvas.width - margin, canvas.height - margin); ctx.lineTo(canvas.width - margin - 40, canvas.height - margin); ctx.stroke();

        setIsGenerating(false);
      };
      
      img.src = URL.createObjectURL(blob);
    } catch (error) {
      toast.error('Generation failed');
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${item.sku || 'ITEM'}_${type.toLowerCase()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleDownloadBoth = async () => {
    // 1. Download current
    handleDownload();
    toast.info("Downloading first tag...");

    // 2. Prepare other type
    const originalType = type;
    const otherType = type === 'BARCODE' ? 'QR' : 'BARCODE';
    setType(otherType);
    
    // We wait for the state update and re-render/re-generation
    setTimeout(() => {
      handleDownload();
      toast.success("Both tags downloaded");
      // Optional: switch back? Let's leave it on the new one so they see it worked
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-900 text-white sm:max-w-[480px] p-0 overflow-hidden rounded-[2rem] shadow-2xl outline-none">
        <DialogHeader className="p-6 pb-3 bg-gradient-to-br from-zinc-900 to-zinc-950 border-b border-zinc-900 relative">
          <div className="absolute top-0 right-0 p-6 opacity-5">
             <BarcodeIcon size={60} />
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
               <QrCode size={20} />
            </div>
            <div>
              <DialogTitle className="text-lg font-black italic uppercase tracking-tighter">Physical Tag Sync</DialogTitle>
              <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest mt-0.5">
                Generate trackable identity cataloging
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
           <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setType('BARCODE')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all hover:bg-zinc-900 group ${type === 'BARCODE' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-900 bg-black opacity-40'}`}
              >
                 <BarcodeIcon size={24} className={type === 'BARCODE' ? 'text-emerald-500' : 'text-zinc-600'} />
                 <span className="text-[9px] font-black uppercase tracking-[0.2em]">Barcode</span>
                 {type === 'BARCODE' && <div className="h-1 w-1 rounded-full bg-emerald-500" />}
              </button>

              <button 
                onClick={() => setType('QR')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all hover:bg-zinc-900 group ${type === 'QR' ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-900 bg-black opacity-40'}`}
              >
                 <QrCode size={24} className={type === 'QR' ? 'text-emerald-500' : 'text-zinc-600'} />
                 <span className="text-[9px] font-black uppercase tracking-[0.2em]">Matrix QR</span>
                 {type === 'QR' && <div className="h-1 w-1 rounded-full bg-emerald-500" />}
              </button>
           </div>

           <div className="bg-zinc-900/40 rounded-[2rem] border border-zinc-900 p-6 flex items-center justify-center min-h-[220px] relative group text-center">
              <canvas 
                ref={canvasRef} 
                className={`max-w-full h-auto rounded-lg shadow-2xl transition-all duration-500 ${isGenerating ? 'opacity-20 scale-95' : 'opacity-100 scale-100'}`}
                style={{ width: '320px' }}
              />
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <Loader2 className="animate-spin text-emerald-500" size={24} />
                </div>
              )}
           </div>

           <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex gap-3 items-start">
              <Info className="text-emerald-500 shrink-0" size={14} />
              <p className="text-[8px] text-zinc-500 font-bold leading-relaxed">
                Includes Name, SKU, and Location for physical identification. Optimized for 3:2 thermal printers.
              </p>
           </div>
        </div>

        <DialogFooter className="p-6 bg-zinc-950/50 border-t border-zinc-900 gap-2 flex-col sm:flex-row">
           <Button 
             variant="outline"
             onClick={handleDownloadBoth}
             disabled={isGenerating}
             className="text-[9px] font-black uppercase tracking-widest text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 h-10 px-4 rounded-xl transition-all w-full sm:w-auto"
           >
             Download Both
           </Button>
           <Button 
             onClick={() => { handleDownload(); toast.success('Download initiated'); }}
             disabled={isGenerating}
             className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-[9px] h-10 px-6 rounded-xl shadow-xl shadow-emerald-500/10 transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2"
           >
             <Download size={14} /> Download Tag
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
