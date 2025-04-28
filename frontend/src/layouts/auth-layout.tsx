import Link from 'next/link';
import React from 'react';

export default function AuthLayout({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={'/'} className="flex flex-col items-center gap-2 font-medium">
                            <h1 className="text-2xl">Acme</h1>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h2 className="text-lg font-medium">{title}</h2>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
