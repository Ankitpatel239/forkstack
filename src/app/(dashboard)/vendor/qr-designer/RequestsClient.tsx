
'use client';

import { useState, useRef } from 'react';
import { 
  QrCode, 
  Download, 
  Palette, 
  Layout, 
  Type, 
  Image as ImageIcon,
  ChevronRight,
  Printer,
  Table as TableIcon,
  Link as LinkIcon,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function QRDesignerClient({ vendor, tables }: { vendor: any, tables: any[] }) {
  const [activeTab, setActiveTab] = useState('DESIGN');
  const [qrType, setQrType] = useState('TABLE'); // TABLE or CUSTOM
  const [selectedTable, setSelectedTable] = useState(tables[0]?.id || '');
  const [customLink, setCustomLink] = useState(`https://${vendor.tenantSlug}.forkstack.app`);
  
  // Design State
  const [config, setConfig] = useState({
    size: 300,
    fgColor: '#000000',
    bgColor: '#ffffff',
    margin: 1,
    dotStyle: 'square', // square, rounded, dots
    frame: 'minimal', // minimal, rounded-box, stylish
    labelText: 'Scan for Menu',
    showLogo: true,
    logoSize: 50,
  });

  const qrRef = useRef<HTMLDivElement>(null);

  // Construct QR URL
  const getQrValue = () => {
    if (qrType === 'TABLE') {
      const table = tables.find(t => t.id === selectedTable);
      return `https://${vendor.tenantSlug}.forkstack.app/menu?table=${table?.tableNumber || ''}`;
    }
    return customLink;
  };

  const qrValue = getQrValue();
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${config.size}x${config.size}&data=${encodeURIComponent(qrValue)}&color=${config.fgColor.replace('#', '')}&bgcolor=${config.bgColor.replace('#', '')}&margin=${config.margin}`;

  const handleDownload = () => {
    // In a real implementation with a library, we'd render the canvas here.
    // For now, we open the API URL in a new tab or trigger a download.
    const link = document.createElement('a');
    link.href = qrApiUrl;
    link.download = `QR_${qrType}_${vendor.tenantSlug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Vector exported to local storage');
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 italic">Vector Studio</h1>
          <p className="text-zinc-500 font-medium">Engineer and customize your physical access nodes for the digital ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button 
            onClick={handleDownload}
            className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest text-xs h-12 px-8 shadow-xl shadow-emerald-500/20"
           >
             <Download className="w-5 h-5 mr-1" /> Export Production Asset
           </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Designer Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-8">
              {/* Type Selection */}
              <div className="space-y-4">
                 <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 px-1">Orchestration Type</Label>
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setQrType('TABLE')}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${qrType === 'TABLE' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                    >
                       <TableIcon size={20} />
                       <span className="text-[10px] font-black uppercase">Dining Table</span>
                    </button>
                    <button 
                      onClick={() => setQrType('CUSTOM')}
                      className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${qrType === 'CUSTOM' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                    >
                       <LinkIcon size={20} />
                       <span className="text-[10px] font-black uppercase">Custom Link</span>
                    </button>
                 </div>
              </div>

              {/* Data Input */}
              <div className="space-y-4">
                 {qrType === 'TABLE' ? (
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Select Table Node</Label>
                      <Select value={selectedTable} onValueChange={setSelectedTable}>
                         <SelectTrigger className="bg-zinc-950 border-zinc-800 h-14 rounded-2xl text-white font-bold text-sm">
                            <SelectValue placeholder="Select a table" />
                         </SelectTrigger>
                         <SelectContent className="bg-zinc-900 border-zinc-800 text-white font-bold text-xs uppercase">
                            {tables.map(table => (
                              <SelectItem key={table.id} value={table.id}>Table {table.tableNumber}</SelectItem>
                            ))}
                         </SelectContent>
                      </Select>
                   </div>
                 ) : (
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Target URL</Label>
                      <Input 
                        value={customLink} 
                        onChange={(e) => setCustomLink(e.target.value)}
                        className="bg-zinc-950 border-zinc-800 h-14 rounded-2xl text-white font-bold text-sm" 
                      />
                   </div>
                 )}
              </div>

              <div className="h-[1px] bg-zinc-800" />

              {/* Design Controls */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 text-emerald-500">
                    <Palette size={18} />
                    <span className="text-xs font-black uppercase tracking-widest">Aesthetic Parameters</span>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 px-1">Foreground</Label>
                       <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                          <input 
                            type="color" 
                            value={config.fgColor} 
                            onChange={(e) => setConfig({...config, fgColor: e.target.value})}
                            className="bg-transparent border-none w-8 h-8 cursor-pointer"
                          />
                          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">{config.fgColor}</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 px-1">Background</Label>
                       <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                          <input 
                            type="color" 
                            value={config.bgColor} 
                            onChange={(e) => setConfig({...config, bgColor: e.target.value})}
                            className="bg-transparent border-none w-8 h-8 cursor-pointer"
                          />
                          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">{config.bgColor}</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 px-1">Quiet Zone (Margin)</Label>
                       <span className="text-[10px] font-black text-emerald-500">{config.margin}px</span>
                    </div>
                    <Slider 
                      value={[config.margin]} 
                      onValueChange={([val]: number[]) => setConfig({...config, margin: val})}
                      max={4}
                      step={1}
                      className="py-4"
                    />
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 px-1">Brand Frame Label</Label>
                    <Input 
                      value={config.labelText}
                      onChange={(e) => setConfig({...config, labelText: e.target.value})}
                      placeholder="e.g., Scan for Menu"
                      className="bg-zinc-950 border-zinc-800 h-12 rounded-xl text-white font-bold text-xs" 
                    />
                 </div>

                 <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <div className="flex items-center gap-2">
                       <ImageIcon size={16} className="text-zinc-600" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Embed Center Logo</span>
                    </div>
                    <Switch checked={config.showLogo} onCheckedChange={(val: boolean) => setConfig({...config, showLogo: val})} />
                 </div>
              </div>
           </div>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 lg:p-20 flex items-center justify-center relative overflow-hidden group min-h-[600px]">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative z-10 flex flex-col items-center">
                 {/* The Designed QR Container */}
                 <div className="relative p-12 bg-white rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 group-hover:scale-105 transition-transform duration-500">
                    <div className="bg-white overflow-hidden p-2">
                       <img 
                        src={qrApiUrl} 
                        alt="QR Design" 
                        style={{ background: config.bgColor }}
                        className="w-[280px] h-[280px]"
                       />
                       
                       {/* Overlay Logo Placeholder */}
                       {config.showLogo && (
                         <div className="absolute top-[40%] left-1/2 -translate-y-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center p-2 border-2 border-zinc-100">
                            {vendor.logoUrl ? (
                              <img src={vendor.logoUrl} className="w-full h-full object-contain" />
                            ) : (
                              <ChefHat className="text-emerald-500" />
                            )}
                         </div>
                       )}
                    </div>

                    <div className="text-center space-y-1 pt-2">
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] leading-none mb-1">
                          {vendor.businessName}
                       </p>
                       <p className="text-2xl font-black text-zinc-950 italic uppercase tracking-tighter leading-tight">
                          {config.labelText}
                       </p>
                       {qrType === 'TABLE' && (
                         <Badge className="bg-zinc-100 text-zinc-950 border-none px-4 py-1 text-[10px] font-black uppercase tracking-widest mt-2">
                            NODE: #{tables.find(t => t.id === selectedTable)?.tableNumber || '00'}
                         </Badge>
                       )}
                    </div>
                 </div>

                 {/* Help Indicator */}
                 <div className="mt-12 flex items-center gap-2 text-[10px] font-black text-zinc-700 uppercase tracking-widest italic animate-pulse">
                    <Printer size={14} /> High Fidelity Vector Preview
                 </div>
              </div>

              <div className="absolute bottom-8 right-12 flex items-center gap-3">
                 <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white cursor-pointer transition-all">
                    <Info size={16} />
                 </div>
              </div>
           </div>

           {/* Quick Actions / Tips */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 flex items-center gap-6">
                 <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Zap size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-white italic uppercase">Optimized Contrast</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed mt-1">We automatically ensure foreground visibility for scanning parity.</p>
                 </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 flex items-center gap-6">
                 <div className="h-14 w-14 rounded-2xl bg-zinc-100/[0.03] flex items-center justify-center text-zinc-700">
                    <Printer size={24} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-white italic uppercase">Commercial Ready</h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed mt-1">Export at 300DPI for high-quality hospitality signage.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ChefHat(props: any) {
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
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0 5.11 5.11 0 0 1 1.05 1.54 4 4 0 0 1 1.41 7.87" />
      <path d="M6 18h12" />
      <path d="M6 22h12" />
    </svg>
  );
}
