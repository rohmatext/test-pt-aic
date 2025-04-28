'use client';

import { DataList, DataListEmpty, DataListItem } from '@/components/data-list';
import { BlockStack, Page, TitleBar } from '@/components/page';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import axios from '@/lib/axios';
import { User } from '@/types';
import { PaginationResponse } from '@/types/pagination';
import Cookies from 'js-cookie';
import { EllipsisIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

export default function UsersPage() {
    const router = useRouter();

    const isMobile = useIsMobile();

    const { data: users, error, mutate } = useSWR<PaginationResponse<User>>('/api/users', fetchUsers);

    async function fetchUsers(uri: string) {
        const token = Cookies.get('token');
        if (!token) return Promise.reject(new Error('No token'));

        try {
            const { data } = await axios.get(uri, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data;
        } catch (error: any) {
            if (error.response) {
                console.error('Fetch users error:', error.response.data);
                throw new Error(error.response.data.message || 'Gagal mengambil data pengguna');
            } else {
                console.error('Unknown error:', error.message);
                throw new Error('Terjadi kesalahan jaringan');
            }
        }
    }

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    return (
        <UserProvider users={users} mutate={mutate} error={error}>
            <Page maxWidth="sm">
                <TitleBar title="Pengguna">
                    <Button onClick={() => router.push('/admin/users/create')}>Tambah</Button>
                </TitleBar>

                <BlockStack>
                    <Card>
                        <CardContent>
                            <BlockStack>
                                <div>{users?.data ? <>{isMobile ? <UserDataList /> : <UserTable />}</> : <UserTableSkeleton />}</div>
                            </BlockStack>
                        </CardContent>
                    </Card>
                </BlockStack>
            </Page>
            <DeleteDialog />
        </UserProvider>
    );
}

const UserContext = createContext<{
    onAction: (eventName: string, user?: User) => void;
    actionName: string | null;
    currentUser: User | null;
    onCancel: () => void;
    onSuccess: (message?: string) => void;
    onFail: (message?: string) => void;
    users?: PaginationResponse<User> | null;
    mutate: () => void;
    error?: any;
}>({
    onAction: () => {},
    actionName: null,
    currentUser: null,
    onCancel: () => {},
    onSuccess: () => {},
    onFail: () => {},
    users: null,
    mutate: () => {},
    error: null,
});

const UserProvider = ({
    children,
    users,
    mutate,
    error,
}: {
    children: React.ReactNode;
    users?: PaginationResponse<User> | null;
    mutate: () => void;
    error?: any;
}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [actionName, setActionName] = useState<string | null>(null);

    const onAction = (eventName?: string, user?: User) => {
        setCurrentUser(user || null);
        setActionName(eventName || null);
    };

    const onCancel = () => {
        setCurrentUser(null);
        setActionName(null);
    };

    const onSuccess = (message?: string) => {
        toast.success(message);
        onCancel();
    };

    const onFail = (message?: string) => {
        toast.error(message);
        onCancel();
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    return (
        <UserContext.Provider value={{ onAction, onCancel, onSuccess, mutate, onFail, actionName, currentUser, users }}>
            {children}
        </UserContext.Provider>
    );
};

const UserTable = () => {
    const { users } = useContext(UserContext);
    const { data: userData }: { data?: User[] } = users || Object.assign({});

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-12 text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userData?.length ? (
                    userData.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{user.roles.at(0).name}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <UserActions user={user} />
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableEmpty colSpan={4}>Tidak ada data</TableEmpty>
                )}
            </TableBody>
        </Table>
    );
};

const UserDataList = () => {
    const { users } = useContext(UserContext);
    const { data: userData }: { data?: User[] } = users || Object.assign({});

    return (
        <DataList>
            {userData?.length ? (
                userData.map((user) => (
                    <DataListItem key={user.id}>
                        <div className="items-between flex flex-col gap-2">
                            <div>
                                <p className="text-sm leading-none font-medium">{user.name}</p>
                                <p className="text-muted-foreground text-xs">{user.email}</p>
                            </div>
                            <div>
                                <p>
                                    <Badge variant="secondary">{user.roles.at(0).name}</Badge>
                                </p>
                            </div>
                        </div>
                        <div>
                            <UserActions user={user} />
                        </div>
                    </DataListItem>
                ))
            ) : (
                <DataListEmpty>Tidak ada data</DataListEmpty>
            )}
        </DataList>
    );
};

const UserActions = ({ user }: { user: User }) => {
    const { onAction } = useContext(UserContext);

    const onDeleteUser = () => {
        onAction('delete', user);
    };
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size={'icon'}>
                    <EllipsisIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/admin/users/edit/${user.id}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" asChild className="cursor-pointer">
                    <button className="w-full" onClick={onDeleteUser}>
                        Hapus
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const DeleteDialog = () => {
    const { actionName, currentUser, onCancel, onSuccess, onFail, mutate } = useContext(UserContext);

    const confirm = () => {
        axios
            .delete(`/api/users/${currentUser?.id}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            })
            .then((res) => {
                onSuccess(res.data.message);
                mutate();
            })
            .catch((error) => {
                onFail(error.response.data.message);
            });
    };

    return (
        <AlertDialog open={actionName === 'delete' && currentUser !== null} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus pengguna</AlertDialogTitle>
                    <AlertDialogDescription>Apakah anda yakin ingin menghapus pengguna {currentUser?.name}?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirm}>Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const UserTableSkeleton = () => {
    return (
        <Table className="animate-pulse">
            <TableHeader>
                <TableRow>
                    <TableHead>
                        <div className="h-4 w-1/4 rounded bg-stone-200"></div>
                    </TableHead>
                    <TableHead>
                        <div className="h-4 w-1/4 rounded bg-stone-200"></div>
                    </TableHead>
                    <TableHead>
                        <div className="h-4 w-1/4 rounded bg-stone-200"></div>
                    </TableHead>
                    <TableHead className="w-12 text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">
                            <div className="h-4 w-1/2 rounded bg-stone-200"></div>
                        </TableCell>
                        <TableCell>
                            <div className="h-4 w-1/2 rounded bg-stone-200"></div>
                        </TableCell>
                        <TableCell>
                            <div className="h-4 w-1/2 rounded bg-stone-200"></div>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="h-8 rounded bg-stone-200"></div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
