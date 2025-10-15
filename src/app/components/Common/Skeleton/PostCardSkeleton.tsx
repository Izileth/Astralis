import { Card, CardContent, CardFooter } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';

export function PostCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50">
      <Skeleton className="w-full h-[140px] rounded-none" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <div className="flex gap-4 w-full border-t pt-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </CardFooter>
    </Card>
  );
}