import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { MessageProvider } from '@/components/context/message-context';
import { NavItem, User } from '@/types';

export default function AppLayout({
    children,
    user,
    navMenu,
    homePage,
}: {
    children: React.ReactNode;
    user: User;
    navMenu: NavItem[];
    homePage: string;
}) {
    return (
        <AppShell>
            <AppSidebar user={user} navMenu={navMenu} homePage={homePage} />
            <AppContent>
                <AppSidebarHeader />
                <MessageProvider>
                    <div className="px-6">{children}</div>
                </MessageProvider>
            </AppContent>
        </AppShell>
    );
}
