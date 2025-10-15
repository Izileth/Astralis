import { Container } from '../Container';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';

export function EditPostPageSkeleton() {
  return (
    <Container className="py-8 max-w-4xl">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0 pt-0">
          <Skeleton className="h-8 w-1/3 mb-6" />
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}