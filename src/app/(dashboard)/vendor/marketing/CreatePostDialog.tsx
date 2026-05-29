'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Image as ImageIcon, Video, Send } from 'lucide-react';
import { createMarketingPost } from '@/app/actions/marketing';
import { toast } from 'sonner';

export function CreatePostDialog({ open, onOpenChange, accounts }: { open: boolean, onOpenChange: (open: boolean) => void, accounts: any[] }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    mediaUrl: '',
    mediaType: 'IMAGE' as 'IMAGE' | 'VIDEO' | 'CAROUSEL',
    platformId: '',
    status: 'SCHEDULED' as 'DRAFT' | 'SCHEDULED' | 'PUBLISHED',
    scheduledFor: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.platformId || !formData.mediaUrl) {
      toast.error('Please select an account and provide a media URL');
      return;
    }
    
    setLoading(true);
    try {
      const selectedAccount = accounts.find(a => a.id === formData.platformId);
      if (!selectedAccount) throw new Error("Account not found");

      await createMarketingPost({
        content: formData.content,
        mediaUrls: [formData.mediaUrl],
        mediaType: formData.mediaType,
        platforms: [selectedAccount.platform],
        status: formData.status,
        scheduledFor: formData.scheduledFor ? new Date(formData.scheduledFor) : undefined
      });
      toast.success('Post created successfully');
      setFormData({ content: '', mediaUrl: '', mediaType: 'IMAGE', platformId: '', status: 'SCHEDULED', scheduledFor: '' });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white w-[95vw] sm:max-w-[500px] rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="mb-6">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-500 mb-4">
             <Send size={24} />
          </div>
          <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Create Post</DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium font-sans mt-2">
            Schedule or publish a new post to your connected social accounts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Target Account</Label>
            <Select 
              value={formData.platformId} 
              onValueChange={(v: any) => setFormData({...formData, platformId: v})}
            >
              <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 text-sm font-bold text-zinc-900 dark:text-white">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold">
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.accountName || account.accountId} ({account.platform})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Media Type</Label>
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline" 
                className={`flex-1 h-12 rounded-xl border-zinc-200 dark:border-zinc-800 ${formData.mediaType === 'IMAGE' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-zinc-950 text-zinc-500'}`}
                onClick={() => setFormData({...formData, mediaType: 'IMAGE'})}
              >
                <ImageIcon size={16} className="mr-2" /> Image
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className={`flex-1 h-12 rounded-xl border-zinc-200 dark:border-zinc-800 ${formData.mediaType === 'VIDEO' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-zinc-950 text-zinc-500'}`}
                onClick={() => setFormData({...formData, mediaType: 'VIDEO'})}
              >
                <Video size={16} className="mr-2" /> Reel / Video
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Media URL</Label>
            <Input 
              value={formData.mediaUrl}
              onChange={e => setFormData({...formData, mediaUrl: e.target.value})}
              placeholder="https://example.com/image.jpg"
              className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 px-4 font-bold text-sm text-zinc-900 dark:text-white" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Caption</Label>
            <Textarea 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              placeholder="Write a caption for your post..."
              className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 min-h-[100px] p-4 font-bold text-sm text-zinc-900 dark:text-white resize-none" 
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v: any) => setFormData({...formData, status: v})}
              >
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 text-sm font-bold text-zinc-900 dark:text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold">
                  <SelectItem value="SCHEDULED">Schedule for Later</SelectItem>
                  <SelectItem value="PUBLISHED">Publish Now</SelectItem>
                  <SelectItem value="DRAFT">Save as Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === 'SCHEDULED' && (
              <div className="space-y-2 flex-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 px-1">Date & Time</Label>
                <Input 
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={e => setFormData({...formData, scheduledFor: e.target.value})}
                  className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 h-12 px-4 font-bold text-sm text-zinc-900 dark:text-white" 
                  required 
                />
              </div>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl shadow-xl shadow-blue-500/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : formData.status === 'PUBLISHED' ? 'Publish Now' : 'Save Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
