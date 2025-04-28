'use client';

import { useMessage } from '@/components/context/message-context';
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
import { formatDate } from '@/lib/utils';
import { PaginationResponse } from '@/types/pagination';
import { Project } from '@/types/project';
import Cookies from 'js-cookie';
import { EllipsisIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import useSWR from 'swr';

export default function ProjectsPage() {
    const { onMessage } = useMessage();

    const router = useRouter();

    const isMobile = useIsMobile();

    const { data: projects, error, mutate } = useSWR<PaginationResponse<Project>>('/api/projects', fetchProjects);

    async function fetchProjects(uri: string) {
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
                if ([401, 403].includes(error.response.status)) {
                    onMessage('error', error.response.data.message);
                    router.push('/');
                }

                console.error('Fetch projects error:', error.response.data);
                throw new Error(error.response.data.message || 'Gagal mengambil data pengguna');
            } else {
                console.error('Unknown error:', error.message);
                onMessage('error', error.message);
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
        <ProjectProvider projects={projects} mutate={mutate} error={error}>
            <Page maxWidth="sm">
                <TitleBar title="Proyek">
                    <Button onClick={() => router.push('/admin/projects/create')}>Tambah</Button>
                </TitleBar>

                <BlockStack>
                    <Card>
                        <CardContent>
                            <BlockStack>
                                <div>{projects?.data ? <>{isMobile ? <ProjectDataList /> : <ProjectTable />}</> : <ProjectTableSkeleton />}</div>
                            </BlockStack>
                        </CardContent>
                    </Card>
                </BlockStack>
            </Page>
            <DeleteDialog />

            <UpdateStatusDialog />
        </ProjectProvider>
    );
}

const ProjectContext = createContext<{
    onAction: (eventName: string, project?: Project) => void;
    actionName: string | null;
    currentProject: Project | null;
    onCancel: () => void;
    projects?: PaginationResponse<Project> | null;
    mutate: () => void;
    error?: any;
}>({
    onAction: () => {},
    actionName: null,
    currentProject: null,
    onCancel: () => {},
    projects: null,
    mutate: () => {},
    error: null,
});

const ProjectProvider = ({
    children,
    projects,
    mutate,
    error,
}: {
    children: React.ReactNode;
    projects?: PaginationResponse<Project> | null;
    mutate: () => void;
    error?: any;
}) => {
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [actionName, setActionName] = useState<string | null>(null);

    const onAction = (eventName?: string, project?: Project) => {
        setCurrentProject(project || null);
        setActionName(eventName || null);
    };

    const onCancel = () => {
        setCurrentProject(null);
        setActionName(null);
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    return <ProjectContext.Provider value={{ onAction, onCancel, mutate, actionName, currentProject, projects }}>{children}</ProjectContext.Provider>;
};

const ProjectTable = () => {
    const { projects } = useContext(ProjectContext);
    const { data: projectData }: { data?: Project[] } = projects || Object.assign({});

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12 text-right"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projectData?.length ? (
                    projectData.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-medium">
                                <div>{row.title}</div>
                                <div className="text-muted-foreground text-xs">{row.description}</div>
                            </TableCell>
                            <TableCell>{`${formatDate(row.start_date)} - ${formatDate(row.end_date) || 'Selesai'}`}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{row.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <ProjectActions project={row} />
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

const ProjectDataList = () => {
    const { projects } = useContext(ProjectContext);
    const { data: projectData }: { data?: Project[] } = projects || Object.assign({});

    return (
        <DataList>
            {projectData?.length ? (
                projectData.map((row) => (
                    <DataListItem key={row.id}>
                        <div className="items-between flex flex-col gap-2">
                            <div>
                                <p className="text-sm leading-none font-medium">{row.title}</p>
                                <p className="text-muted-foreground text-xs">{row.description}</p>
                                <p className="text-muted-foreground text-xs">
                                    {`${formatDate(row.start_date)} - ${formatDate(row.end_date) || 'Selesai'}`}
                                </p>
                            </div>
                            <div>
                                <p>
                                    <Badge variant="secondary">{row.status}</Badge>
                                </p>
                            </div>
                        </div>
                        <div>
                            <ProjectActions project={row} />
                        </div>
                    </DataListItem>
                ))
            ) : (
                <DataListEmpty>Tidak ada data</DataListEmpty>
            )}
        </DataList>
    );
};

const ProjectActions = ({ project }: { project: Project }) => {
    const { onAction } = useContext(ProjectContext);

    const onDeleteProject = () => {
        onAction('delete', project);
    };

    const onProjectStatusUpdate = () => {
        onAction('status', project);
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
                    <Link href={`/admin/projects/show/${project.id}`}>Detail</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={`/admin/projects/edit/${project.id}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                    <button className="w-full" onClick={onProjectStatusUpdate}>
                        Ubah status
                    </button>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" asChild className="cursor-pointer">
                    <button className="w-full" onClick={onDeleteProject}>
                        Hapus
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const DeleteDialog = () => {
    const { actionName, currentProject, onCancel, mutate } = useContext(ProjectContext);
    const { onMessage } = useMessage();

    const confirm = () => {
        axios
            .delete(`/api/projects/${currentProject?.id}`, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            })
            .then((res) => {
                onMessage('success', res.data.message);
                mutate();
            })
            .catch((error) => {
                onMessage('error', error.response.data.message);
            });
    };

    return (
        <AlertDialog open={actionName === 'delete' && currentProject !== null} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus pengguna</AlertDialogTitle>
                    <AlertDialogDescription>Apakah anda yakin ingin menghapus pengguna {currentProject?.name}?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={confirm}>Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const UpdateStatusDialog = () => {
    const { actionName, currentProject, onCancel, mutate } = useContext(ProjectContext);
    const { onMessage } = useMessage();

    const confirm = (status: 'completed' | 'cancelled') => {
        if (!['completed', 'cancelled'].includes(status)) {
            onMessage('error', 'Gagal mengubah status proyek');
            return;
        }

        axios
            .patch(
                `/api/projects/${currentProject?.id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                },
            )
            .then((res) => {
                onMessage('success', res.data.message);
                mutate();
            })
            .catch((error) => {
                onMessage('error', error.response.data.message);
            });
    };

    return (
        <AlertDialog open={actionName === 'status' && currentProject !== null} onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ubah status</AlertDialogTitle>
                    <AlertDialogDescription>Apakah anda yakin ingin mengubah status proyek {currentProject?.name}?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs"
                        onClick={() => confirm('cancelled')}
                    >
                        Batalkan
                    </AlertDialogAction>
                    <AlertDialogAction onClick={() => confirm('completed')}>Selesai</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

const ProjectTableSkeleton = () => {
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
