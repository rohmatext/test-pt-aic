'use client';
import { useMessage } from '@/components/context/message-context';
import { DataList, DataListEmpty, DataListItem } from '@/components/data-list';
import { BlockStack, Page, TitleBar } from '@/components/page';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from '@/lib/axios';
import { formatCurrency, formatDate } from '@/lib/utils';
import { User } from '@/types';
import { AdditionalFee } from '@/types/additional-fee';
import { Project } from '@/types/project';
import { Remuneration } from '@/types/remuneration';
import { Task } from '@/types/task';
import Cookies from 'js-cookie';
import { EllipsisIcon, FilePlusIcon, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AddAdditionalFee } from './additional-fee';
import { AddMember } from './member';

export default function ShowProjectPage() {
    const { onMessage } = useMessage();
    const params = useParams();
    const router = useRouter();

    const [project, setProject] = useState<Project>(Object.assign({}));
    const [members, setMembers] = useState<User[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [remunerations, setRemunerations] = useState<Remuneration[]>(Object.assign({}));
    const [additionalFees, setAdditionalFees] = useState<AdditionalFee[]>([]);

    const [dialog, setDialog] = useState<{
        addMember: boolean;
        removeMember: boolean;
        additionalFee: boolean;
    }>(
        Object.assign({
            addMember: false,
            removeMember: false,
            additionalFee: false,
        }),
    );

    const onOpenDialogAddMember = (value: boolean) => {
        setDialog({
            ...dialog,
            addMember: value,
        });
    };

    const onOpenDialogAdditionalFee = (value: boolean) => {
        setDialog({
            ...dialog,
            additionalFee: value,
        });
    };

    useEffect(() => {
        axios
            .get(`/api/projects/${params.id}`, { headers: { Authorization: `Bearer ${Cookies.get('token')}` } })
            .then((res) => {
                setProject(res.data.data);
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    alert(error.response.data.message);
                    router.push('/manager/projects');
                }
                console.log(error);
            });

        fetchMembers();

        fetchTasks();

        fetchAdditionalFees();

        fetchRemunerations();
    }, []);

    const fetchMembers = () => {
        axios
            .get(`/api/projects/${params.id}/members`, { headers: { Authorization: `Bearer ${Cookies.get('token')}` } })
            .then((res) => {
                setMembers(res.data.data);
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    alert(error.response.data.message);
                    router.push('/manager/projects');
                }

                if ([401, 403].includes(error.response.status)) {
                    onMessage('error', error.response.data.message);
                    router.push('/');
                }
            });
    };

    const onSuccessAddMember = () => {
        fetchMembers();
        onOpenDialogAddMember(false);
    };

    const onSuccessAdditionalFee = () => {
        fetchAdditionalFees();
        onOpenDialogAdditionalFee(false);
    };

    const fetchTasks = () => {
        axios
            .get(`/api/projects/${params.id}/tasks`, { headers: { Authorization: `Bearer ${Cookies.get('token')}` } })
            .then((res) => {
                setTasks(res.data.data);
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    alert(error.response.data.message);
                    router.push('/employee/projects');
                }

                if (error.response.status == 403) {
                    onMessage('error', error.response.data.message);
                    router.push('/');
                }
            });
    };

    const fetchAdditionalFees = () => {
        axios
            .get(`/api/additional-fees`, { headers: { Authorization: `Bearer ${Cookies.get('token')}` }, params: { project_id: params.id } })
            .then((res) => {
                setAdditionalFees(res.data.data);
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    alert(error.response.data.message);
                    router.push('/employee/projects');
                }

                if (error.response.status == 403) {
                    onMessage('error', error.response.data.message);
                    router.push('/');
                }
            });
    };

    const fetchRemunerations = () => {
        axios
            .get(`/api/projects/${params.id}/remunerations`, { headers: { Authorization: `Bearer ${Cookies.get('token')}` } })
            .then((res) => {
                setRemunerations(res.data.data.remunerations);
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    alert(error.response.data.message);
                    router.push('/employee/projects');
                }
                if (error.response.status == 403) {
                    onMessage('error', error.response.data.message);
                    router.push('/');
                }
                console.log(error);
            });
    };

    return (
        <>
            <Page maxWidth="md">
                <TitleBar
                    title={`Proyek #${params.id}`}
                    titleMetadata={<Badge variant="outline">{project?.status}</Badge>}
                    navigation="/manager/projects"
                    subtitle={`Project detail dari ${project?.title}`}
                />
                <BlockStack className="flex-row">
                    <BlockStack className="flex-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Remuneration</CardTitle>
                            </CardHeader>
                            <CardContent className="-mt-6">
                                {remunerations.length > 0 ? (
                                    <DataList>
                                        {remunerations.map((remuneration, index) => (
                                            <DataListItem key={index} className="hover:bg-secondary rounded-sm p-2">
                                                <div className="flex-1">
                                                    <Badge variant="outline">#{remuneration.user.name}</Badge>
                                                    <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
                                                        <span>
                                                            {remuneration.hours_spent} Jam x {formatCurrency(Number(remuneration.hourly_rate))}
                                                        </span>
                                                        <span>{formatCurrency(remuneration.base_fee)}</span>
                                                    </div>
                                                    <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
                                                        <span>
                                                            {`${formatCurrency(Number(remuneration.additional_fees.group.total))} / ${remuneration.additional_fees.group.member_count}`}{' '}
                                                            Anggota
                                                        </span>
                                                        <span>{formatCurrency(Number(remuneration.additional_fees.group.per_member))}</span>
                                                    </div>
                                                    <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
                                                        <span>User</span>
                                                        <span>{formatCurrency(Number(remuneration.additional_fees.user))}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-muted-foreground text-sm">Total</span>
                                                        <span className="text-sm">{formatCurrency(Number(remuneration.total_fee))}</span>
                                                    </div>
                                                </div>
                                            </DataListItem>
                                        ))}
                                    </DataList>
                                ) : (
                                    <DataListEmpty>Belum ada task</DataListEmpty>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Daftar Task</CardTitle>
                            </CardHeader>
                            <CardContent className="-mt-6">
                                {tasks.length > 0 ? (
                                    <DataList>
                                        {tasks.map((task) => (
                                            <DataListItem key={task.id} className="hover:bg-secondary rounded-sm p-2">
                                                <div>
                                                    <Badge variant="outline">#{task.user.name}</Badge>
                                                    <div>{task.description}</div>
                                                    <div className="text-muted-foreground text-sm">{formatDate(task.task_date)}</div>
                                                    <div>{task.hours} Jam</div>
                                                </div>
                                                <div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size={'icon'}>
                                                                <EllipsisIcon />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                                <Link href={`/manager/projects/show/${params.id}/tasks/edit/${task.id}`}>Edit</Link>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </DataListItem>
                                        ))}
                                    </DataList>
                                ) : (
                                    <DataListEmpty>Belum ada task</DataListEmpty>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center justify-between">
                                        <div>Biaya Tambahan</div>
                                        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => onOpenDialogAdditionalFee(true)}>
                                            <FilePlusIcon />
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="-mt-6">
                                {additionalFees.length > 0 ? (
                                    <DataList>
                                        {additionalFees.map((additionalFee) => (
                                            <DataListItem key={additionalFee.id} className="hover:bg-secondary rounded-sm p-2">
                                                <div>
                                                    <div>{additionalFee.description}</div>
                                                    <div className="text-muted-foreground text-sm">{additionalFee.user?.name || '-'}</div>
                                                </div>
                                                <div>{formatCurrency(additionalFee.amount)}</div>
                                            </DataListItem>
                                        ))}
                                    </DataList>
                                ) : (
                                    <DataListEmpty>Belum ada task</DataListEmpty>
                                )}
                            </CardContent>
                        </Card>
                    </BlockStack>
                    <BlockStack className="w-1/3">
                        <Card>
                            <CardContent>
                                <CardTitle>{project?.title}</CardTitle>
                                <CardDescription>
                                    <BlockStack className="mt-4 gap-2">
                                        {project?.description && (
                                            <div className="mb-2">
                                                <p>{project.description}</p>
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-sm leading-none font-medium">Mulai</p>
                                            <p className="text-muted-foreground text-xs">{project?.start_date}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm leading-none font-medium">Selesai</p>
                                            <p className="text-muted-foreground text-xs">{project?.end_date || 'Tidak diatur'}</p>
                                        </div>
                                    </BlockStack>
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent>
                                <CardTitle>
                                    <div className="flex items-center justify-between">
                                        <div>Anggota</div>
                                        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => onOpenDialogAddMember(true)}>
                                            <UserPlus />
                                        </Button>
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    <BlockStack className="mt-4 gap-2">
                                        <DataList>
                                            {members?.length ? (
                                                members.map((member) => (
                                                    <DataListItem key={member.id} className="py-2">
                                                        <div className="w-full flex-1">
                                                            <p className="text-sm leading-none font-medium">{member.user?.name}</p>
                                                            <p className="text-muted-foreground text-xs">{formatCurrency(member.hourly_rate)}</p>
                                                        </div>
                                                    </DataListItem>
                                                ))
                                            ) : (
                                                <DataListEmpty>Tidak ada data</DataListEmpty>
                                            )}
                                        </DataList>
                                    </BlockStack>
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </BlockStack>
                </BlockStack>
            </Page>

            <AddMember open={dialog.addMember} onOpenChange={onOpenDialogAddMember} onSuccess={onSuccessAddMember} />
            <AddAdditionalFee open={dialog.additionalFee} onOpenChange={onOpenDialogAdditionalFee} onSuccess={onSuccessAdditionalFee} />
        </>
    );
}
