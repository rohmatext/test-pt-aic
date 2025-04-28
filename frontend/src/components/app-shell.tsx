import { SidebarProvider } from '@/components/ui/sidebar';
import { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
    return <SidebarProvider>{children}</SidebarProvider>;
}
