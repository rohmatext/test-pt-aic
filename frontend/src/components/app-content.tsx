import { SidebarInset } from '@/components/ui/sidebar';
import * as React from 'react';

export function AppContent({ children, ...props }: React.ComponentProps<'main'>) {
    return <SidebarInset {...props}>{children}</SidebarInset>;
}
