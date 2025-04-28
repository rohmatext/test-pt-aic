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
import { Textarea } from '@/components/ui/textarea';
import axios from '@/lib/axios';
import { ErrorBag, User } from '@/types';
import { PaginationResponse } from '@/types/pagination';
import { DialogDescription } from '@radix-ui/react-dialog';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AddAdditionalFee({
    open,
    onOpenChange,
    onSuccess,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}) {
    const { onMessage } = useMessage();
    const params = useParams();
    const router = useRouter();
    const [users, setUsers] = useState<PaginationResponse<User>>(Object.assign({}));
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isFindMember, setIsFindMember] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const [amount, setAmount] = useState<number | string>(0);
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
                .get(`/api/projects/${params.id}/members`, {
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
        setIsFindMember(false);
        setErrors(Object.assign({}));
    };

    useEffect(() => {
        if (open) {
            onSearch();
        }
        reset();
        setDescription('');
        setAmount(0);
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
                `/api/additional-fees`,
                { user_id: selectedUser?.id || null, amount: amount, description: description, project_id: params.id },
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
                    <DialogTitle>Tambah biaya</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    {isFindMember && <Input placeholder="Cari member" onChange={(e) => onSearch(e.target.value)} />}
                </DialogDescription>
                <ScrollArea className="-mx-2 h-[360px]">
                    <>
                        <div className="px-2">
                            {!isFindMember && (
                                <>
                                    {selectedUser ? (
                                        <BlockStack className="border-border gap-2 rounded-md border p-4">
                                            <div>{selectedUser.name}</div>
                                            <div className="text-muted-foreground text-xs">{selectedUser.email}</div>
                                        </BlockStack>
                                    ) : (
                                        <button className="w-full cursor-pointer" onClick={() => setIsFindMember(true)}>
                                            <BlockStack className="border-border gap-2 rounded-md border p-4">
                                                <div className="text-muted-foreground">Pilih member</div>
                                                <div className="text-muted-foreground text-xs">Pilih member untuk menambahkan biaya</div>
                                            </BlockStack>
                                        </button>
                                    )}
                                    <InputError message={errors.user_id} />
                                    <BlockStack className="mt-4 gap-2">
                                        <Label htmlFor="amount">Jumlah</Label>
                                        <CurrencyInput
                                            onChange={(value) => {
                                                setAmount(value);
                                            }}
                                            id="amount"
                                            value={amount as number}
                                        />
                                        <InputError message={errors.amount} />
                                    </BlockStack>
                                    <BlockStack className="mt-4 gap-2">
                                        <Label htmlFor="description">Deskripsi</Label>
                                        <Textarea id="description" onChange={(e) => setDescription(e.target.value)} value={description} />
                                        <InputError message={errors.description} />
                                    </BlockStack>
                                </>
                            )}
                        </div>
                        {isFindMember && (
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
                                                            setSelectedUser(user.user);
                                                            setIsFindMember(false);
                                                        }}
                                                    >
                                                        <div className="flex-1">
                                                            <div>{user.user.name}</div>
                                                            <div className="text-muted-foreground text-xs">{user.user.email}</div>
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
                    </>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">Tutup</Button>
                    </DialogClose>
                    <Button
                        disabled={(!isFindMember && !selectedUser) || isLoading}
                        variant="secondary"
                        onClick={() => {
                            setSelectedUser(null);
                            setIsFindMember(false);
                        }}
                    >
                        Tanpa member
                    </Button>
                    <Button disabled={isFindMember || isLoading} onClick={onSave}>
                        <Loader isLoading={isLoading} className="mr-1" />
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
