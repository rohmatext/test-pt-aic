'use client';

import LoadingPage from '@/components/loading-page';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { NavItem } from '@/types';
import { BookText, LayoutGrid } from 'lucide-react';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/employee',
            icon: LayoutGrid,
            active: '/employee',
        },
        {
            title: 'Proyek',
            href: '/employee/projects',
            icon: BookText,
            active: '/employee/projects/*',
        },
    ];

    if (!user) return <LoadingPage />;
    return (
        <AppLayout navMenu={mainNavItems} user={user} homePage="/employee">
            {children}
        </AppLayout>
    );
}
