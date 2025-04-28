import { useMessage } from '@/components/context/message-context';
import { CurrencyInput } from '@/components/currency-input';
import { DataList, DataListEmpty, DataListItem } from '@/components/data-list';
import InputError from '@/components/input-error';
import Loader from '@/components/loader';
import { BlockStack } from '@/components/page';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from '@/lib/axios';
import { ErrorBag, User } from '@/types';
import { PaginationResponse } from '@/types/pagination';
import { DialogDescription } from '@radix-ui/react-dialog';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AddMember({ open, onOpenChange, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; onSuccess?: () => void }) {
    const { onMessage } = useMessage();
    const params = useParams();
    const router = useRouter();
    const [users, setUsers] = useState<PaginationResponse<User>>(Object.assign({}));
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [hourlyRate, setHourlyRate] = useState<number | string>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<ErrorBag>(Object.assign({}));

    const onSearch = (value?: string) => {
        const debounce = (func: (...args: any[]) => void, delay: number) => {
            let timeoutId: NodeJS.Timeout;
            return (...args: any[]) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func(...args), delay);
            };
        };

        const fetchUsers = async (query?: string) => {
            setIsLoading(true);
            axios
                .get(`/api/users`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                    params: {
                        search: query,
                    },
                })
                .then((res) => {
                    setUsers(res.data);
                })
                .catch((error) => {
                    console.error(error);

                    if ([401, 403].includes(error.response.status)) {
                        onMessage('error', error.response.data.message);
                        router.push('/');
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        const debouncedFetchUsers = debounce(fetchUsers, 300);

        debouncedFetchUsers(value);
    };

    const reset = () => {
        setSelectedUser(null);
        setHourlyRate(0);
        setErrors(Object.assign({}));
    };

    useEffect(() => {
        if (open) {
            onSearch();
        }
        reset();
        return () => setUsers(Object.assign({}));
    }, [open]);

    useEffect(() => {
        if (!selectedUser) {
            reset();
        }
    }, [selectedUser]);

    const onSave = () => {
        setIsLoading(true);
        axios
            .post(
                `/api/projects/${params.id}/members`,
                { user_id: selectedUser?.id, hourly_rate: hourlyRate },
                { headers: { Authorization: `Bearer ${Cookies.get('token')}` } },
            )
            .then((res) => {
                onMessage('success', res.data.message);
                onSuccess?.();
                reset();
            })
            .catch((error) => {
                if ([401, 403].includes(error.response.status)) {
                    onMessage('error', error.response.data.message);
                    router.push('/');
                }
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah member</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {!selectedUser && <Input placeholder="Cari member" onChange={(e) => onSearch(e.target.value)} />}
                </DialogDescription>
                <ScrollArea className="-mx-2 h-[360px]">
                    {selectedUser ? (
                        <div className="px-2">
                            <BlockStack className="border-border gap-2 rounded-md border p-4">
                                <div>{selectedUser.name}</div>
                                <div className="text-muted-foreground text-xs">{selectedUser.email}</div>
                            </BlockStack>
                            <InputError message={errors.user_id} />
                            <BlockStack className="mt-4 gap-2">
                                <Label htmlFor="hourly_rate">Rate perjam</Label>
                                <CurrencyInput
                                    onChange={(value) => {
                                        setHourlyRate(value);
                                    }}
                                    id="hourly_rate"
                                    value={hourlyRate as number}
                                />
                                <InputError message={errors.hourly_rate} />
                            </BlockStack>
                        </div>
                    ) : (
                        <>
                            {isLoading ? (
                                <div className="flex h-[360px] items-center justify-center">
                                    <Loader isLoading={true} className="size-16" />
                                </div>
                            ) : (
                                <>
                                    {users.data?.length ? (
                                        <DataList>
                                            {users.data.map((user) => (
                                                <DataListItem
                                                    key={user.id}
                                                    className="hover:bg-secondary p-2"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                    }}
                                                >
                                                    <div className="flex-1">
                                                        <div>{user.name}</div>
                                                        <div className="text-muted-foreground text-xs">{user.email}</div>
                                                    </div>
                                                </DataListItem>
                                            ))}
                                        </DataList>
                                    ) : (
                                        <DataListEmpty>Tidak ada data</DataListEmpty>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Tutup</Button>
                    </DialogClose>
                    <Button disabled={!selectedUser} variant="secondary" onClick={() => setSelectedUser(null)}>
                        Pilih member
                    </Button>
                    <Button disabled={!selectedUser} onClick={onSave}>
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
