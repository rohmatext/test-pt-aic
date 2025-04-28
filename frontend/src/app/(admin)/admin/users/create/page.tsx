'use client';

import { useMessage } from '@/components/context/message-context';
import InputError from '@/components/input-error';
import Loader from '@/components/loader';
import { BlockStack, Page, TitleBar } from '@/components/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from '@/lib/axios';
import { ErrorBag } from '@/types';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UsersCreatePage() {
    const { onMessage } = useMessage();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorBag>(Object.assign({}));

    const [data, setStateData] = useState(
        Object.assign({
            name: '',
            email: '',
            role: '',
        }),
    );

    const setData = (key: string, value: string) => {
        setStateData({
            ...data,
            [key]: value,
        });
    };

    const onSave = () => {
        setIsLoading(true);
        axios
            .post('/api/users', data, {
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
    return (
        <Page maxWidth="sm">
            <TitleBar title="Tambah Pengguna" navigation="/admin/users" />
            <BlockStack>
                <Card>
                    <CardContent>
                        <BlockStack>
                            <BlockStack className="gap-2">
                                <Label>Nama</Label>
                                <Input onChange={(e) => setData('name', e.target.value)} />
                                <InputError message={errors.name} />
                            </BlockStack>
                            <BlockStack className="gap-2">
                                <Label>Email</Label>
                                <Input onChange={(e) => setData('email', e.target.value)} />
                                <InputError message={errors.email} />
                            </BlockStack>
                            <BlockStack className="gap-2">
                                <Label>Role</Label>
                                <Select onValueChange={(value) => setData('role', value)} defaultValue={data.role}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="employee">Pegawai</SelectItem>
                                        <SelectItem value="manager">Manager</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
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
