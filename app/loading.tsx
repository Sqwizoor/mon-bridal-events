
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container min-h-screen py-8 space-y-8">
       {/* Simple Hero Skeleton */}
       <div className="w-full h-[40vh] bg-muted/20 rounded-xl relative overflow-hidden">
          <Skeleton className="absolute inset-0 w-full h-full" />
       </div>

       {/* Content grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
             <Skeleton className="h-10 w-1/2" />
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-5/6" />
             <div className="grid grid-cols-2 gap-4 pt-4">
               <Skeleton className="h-40 rounded-xl" />
               <Skeleton className="h-40 rounded-xl" />
             </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
       </div>
    </div>
  );
}
