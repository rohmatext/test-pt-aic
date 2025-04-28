import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';

export default function Loader({ isLoading, className }: { isLoading: boolean; className?: string }) {
    return <>{isLoading && <LoaderCircle className={cn('h-4 w-4 animate-spin', className)} />}</>;
}
