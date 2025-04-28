'use client';

import { BlockStack, Page, TitleBar } from '@/components/page';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export default function Manager() {
    const { user } = useAuth({
        middleware: 'auth',
    });

    return (
        <Page>
            <TitleBar title={`Selamat Datang ${user?.name}`} />
            <BlockStack>
                <Card>
                    <CardContent>Dashboard Employee</CardContent>
                </Card>
            </BlockStack>
        </Page>
    );
}
