'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTiffinPlan } from "@/app/actions/tiffin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeletePlanButtonProps {
  planId: string;
}

export function DeletePlanButton({ planId }: DeletePlanButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteTiffinPlan(planId);
      toast.success("Plan deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete plan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-90">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl bg-card/95 backdrop-blur-xl border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the tiffin plan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
            Delete Plan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
