'use client';
import { Page, TitleBar } from '@/components/page';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export default function Manager() {
    const { user } = useAuth();
    return (
        <Page maxWidth="sm">
            <TitleBar title="Dashboard" />
            <Card>
                <CardContent>Hello {user?.name}</CardContent>
            </Card>
        </Page>
    );
}
