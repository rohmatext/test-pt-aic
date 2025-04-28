import { LoaderCircle } from 'lucide-react';

export default function LoadingPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <LoaderCircle className="size-24 animate-spin text-stone-600" />
        </div>
    );
}
