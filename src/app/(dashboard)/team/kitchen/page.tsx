'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChefHat } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: { name: string; quantity: number }[];
  status: string;
  createdAt: string;
}

export default function KitchenDisplay() {
  const queryClient = useQueryClient();
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['kitchenOrders'],
    queryFn: async () => {
      const res = await fetch('/api/team/orders?status=PENDING,PROCESSING');
      return res.json();
    },
    refetchInterval: autoRefresh ? 5000 : false,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      await fetch(`/api/team/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kitchenOrders'] }),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'PROCESSING': return 'bg-blue-500';
      case 'READY': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ChefHat className="h-8 w-8" /> Kitchen Display
        </h1>
        <Button variant="outline" onClick={() => setAutoRefresh(!autoRefresh)}>
          {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order: Order) => (
          <Card key={order.id} className="overflow-hidden">
            <div className={`h-2 ${getStatusColor(order.status)}`} />
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Table {order.tableNumber}
                  </p>
                </div>
                <Badge variant="outline">{order.status}</Badge>
              </div>

              <div className="border-t pt-2">
                <ul className="space-y-1">
                  {order.items.map((item: any, idx: any) => (
                    <li key={idx} className="text-sm">
                      {item.quantity}× {item.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                {order.status === 'PENDING' && (
                  <Button size="sm" onClick={() => updateStatus.mutate({ orderId: order.id, status: 'PROCESSING' })}>
                    Start Preparing
                  </Button>
                )}
                {order.status === 'PROCESSING' && (
                  <Button size="sm" variant="secondary" onClick={() => updateStatus.mutate({ orderId: order.id, status: 'READY' })}>
                    Mark Ready
                  </Button>
                )}
                {order.status === 'READY' && (
                  <Button size="sm" variant="outline" disabled>Ready for Pickup</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}