'use client';

import { useMessage } from '@/components/context/message-context';
import InputError from '@/components/input-error';
import Loader from '@/components/loader';
import LoadingPage from '@/components/loading-page';
import { BlockStack, Page, TitleBar } from '@/components/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from '@/lib/axios';
import { ErrorBag } from '@/types';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserEditPage() {
    const params = useParams();
    const { onMessage } = useMessage();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorBag>(Object.assign({}));

    const [data, setStateData] = useState(
        Object.assign({
            name: '',
            email: '',
        }),
    );

    const getUser = () => {
        setIsPageLoading(true);
        axios
            .get(`/api/users/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            })
            .then((res) => {
                setStateData({
                    name: res.data.data.name,
                    email: res.data.data.email,
                });
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    onMessage('error', error.response.data.message);
                    router.push('/admin/users');
                    return;
                }

                if ([401, 403].includes(error.response.status)) {
                    onMessage('error', error.response.data.message);
                    router.push('/');
                    return;
                }
            })
            .finally(() => {
                setIsPageLoading(false);
            });
    };

    const setData = (key: string, value: string) => {
        setStateData({
            ...data,
            [key]: value,
        });
    };

    useEffect(() => {
        getUser();
    }, []);

    const onSave = () => {
        setIsLoading(true);
        axios
            .patch(`/api/users/${params.id}`, data, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            })
            .then((res) => {
                onMessage('success', res.data.message);
                router.push('/admin/users');
            })
            .catch((error) => {
                setErrors(error.response.data.errors);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    if (isPageLoading) {
        return <LoadingPage />;
    }
    return (
        <Page maxWidth="sm">
            <TitleBar title="Edit Pengguna" navigation="/admin/users" />
            <BlockStack>
                <Card>
                    <CardContent>
                        <BlockStack>
                            <BlockStack className="gap-2">
                                <Label>Nama</Label>
                                <Input onChange={(e) => setData('name', e.target.value)} value={data.name} />
                                <InputError message={errors.name} />
                            </BlockStack>
                            <BlockStack className="gap-2">
                                <Label>Email</Label>
                                <Input onChange={(e) => setData('email', e.target.value)} value={data.email} />
                                <InputError message={errors.email} />
                            </BlockStack>
                        </BlockStack>
                    </CardContent>
                </Card>
                <div>
                    <Button onClick={onSave} disabled={isLoading}>
                        <Loader isLoading={isLoading} className="mr-1" />
                        Simpan
                    </Button>
                </div>
            </BlockStack>
        </Page>
    );
}
