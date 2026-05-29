'use client';

import { useState } from 'react';
import { Megaphone, Link as LinkIcon, Camera, Share2, Plus, Trash2, Calendar, LayoutGrid, CheckCircle2, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConnectAccountDialog } from './ConnectAccountDialog';
import { CreatePostDialog } from './CreatePostDialog';
import { disconnectSocialAccount, deleteMarketingPost } from '@/app/actions/marketing';
import { toast } from 'sonner';

export function MarketingClientPage({ initialAccounts, initialPosts }: { initialAccounts: any[], initialPosts: any[] }) {
  const [activeTab, setActiveTab] = useState('posts');
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleDisconnect = async (accountId: string) => {
    try {
      await disconnectSocialAccount(accountId);
      toast.success('Account disconnected');
    } catch (e: any) {
      toast.error('Failed to disconnect account');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteMarketingPost(postId);
      toast.success('Post deleted');
    } catch (e: any) {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 md:pl-0 h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic flex items-center gap-3">
            <Megaphone className="text-blue-500" size={32} /> Marketing Suite
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Manage your social media presence directly from ForkStack.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-1 h-auto mb-8">
          <TabsTrigger 
            value="posts" 
            className="rounded-xl px-6 py-2.5 font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white transition-all uppercase tracking-widest text-zinc-500"
          >
            Posts & Calendar
          </TabsTrigger>
          <TabsTrigger 
            value="accounts" 
            className="rounded-xl px-6 py-2.5 font-bold text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white transition-all uppercase tracking-widest text-zinc-500"
          >
            Connected Accounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-[0.1em]">Your Posts</h2>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Manage scheduled and published content</p>
            </div>
            <Button 
              onClick={() => setIsCreatePostOpen(true)}
              disabled={initialAccounts.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-xl"
            >
              <Plus size={16} className="mr-2" /> Create New Post
            </Button>
          </div>

          {initialAccounts.length === 0 && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 p-6 rounded-3xl text-center">
              <p className="text-orange-600 dark:text-orange-400 font-bold mb-4">You need to connect at least one social media account before creating posts.</p>
              <Button onClick={() => setActiveTab('accounts')} variant="outline" className="border-orange-200 dark:border-orange-800 bg-white dark:bg-zinc-900">
                Go to Accounts Tab
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialPosts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col group">
                <div className="h-48 bg-zinc-100 dark:bg-zinc-950 relative">
                  {post.mediaUrls[0] ? (
                    <img src={post.mediaUrls[0]} alt="Post media" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      <LayoutGrid size={32} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {post.platforms.includes('FACEBOOK') && <Badge className="bg-blue-600 text-white shadow-lg"><Share2 size={12} /></Badge>}
                    {post.platforms.includes('INSTAGRAM') && <Badge className="bg-pink-600 text-white shadow-lg"><Camera size={12} /></Badge>}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant="outline" className={`font-bold tracking-widest uppercase text-[9px] ${
                      post.status === 'PUBLISHED' ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30' :
                      post.status === 'SCHEDULED' ? 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/30' :
                      'text-zinc-500'
                    }`}>
                      {post.status}
                    </Badge>
                    <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1">
                      {post.status === 'PUBLISHED' ? <CheckCircle2 size={12} className="text-emerald-500" /> : <Clock size={12} />}
                      {new Date(post.scheduledFor || post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium line-clamp-3 mb-4">{post.content || 'No caption'}</p>
                  
                  <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 px-2"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {initialPosts.length === 0 && (
               <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-4">
                   <Calendar size={32} />
                 </div>
                 <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-widest">No Posts Yet</h3>
                 <p className="text-zinc-500 font-medium mt-2 max-w-sm">Create your first marketing post to engage with your customers on social media.</p>
               </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-[0.1em]">Connected Accounts</h2>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Link your Facebook Pages and Instagram Business accounts</p>
            </div>
            <Button 
              onClick={() => setIsConnectOpen(true)}
              className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-xl"
            >
              <LinkIcon size={16} className="mr-2" /> Connect Account
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialAccounts.map((account) => (
              <div key={account.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${account.platform === 'FACEBOOK' ? 'bg-blue-600' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`} />
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${account.platform === 'FACEBOOK' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-pink-50 dark:bg-pink-900/20 text-pink-600'}`}>
                      {account.platform === 'FACEBOOK' ? <Share2 size={24} /> : <Camera size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white">{account.accountName || account.accountId}</h3>
                      <p className="text-xs text-zinc-500 font-medium">{account.platform}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-200">Connected</Badge>
                </div>
                
                <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Button 
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-950/30 font-bold text-xs uppercase tracking-widest"
                    onClick={() => handleDisconnect(account.id)}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            ))}
            
            {initialAccounts.length === 0 && (
               <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 mb-4">
                   <LinkIcon size={32} />
                 </div>
                 <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-widest">No Accounts Linked</h3>
                 <p className="text-zinc-500 font-medium mt-2 max-w-sm">Connect your social media accounts to start posting content.</p>
               </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ConnectAccountDialog open={isConnectOpen} onOpenChange={setIsConnectOpen} />
      <CreatePostDialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} accounts={initialAccounts} />
    </div>
  );
}
