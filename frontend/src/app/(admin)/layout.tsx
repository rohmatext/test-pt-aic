'use client';

import LoadingPage from '@/components/loading-page';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/layouts/app-layout';
import { NavItem } from '@/types';
import { BookText, LayoutGrid, UserRound } from 'lucide-react';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin',
            icon: LayoutGrid,
            active: '/admin',
        },
        {
            title: 'Proyek',
            href: '/admin/projects',
            icon: BookText,
            active: '/admin/projects/*',
        },
        {
            title: 'Pengguna',
            href: '/admin/users',
            icon: UserRound,
            active: '/admin/users/*',
        },
    ];

    if (!user) return <LoadingPage />;
    return (
        <AppLayout navMenu={mainNavItems} user={user} homePage="/admin">
            {children}
        </AppLayout>
    );
}
