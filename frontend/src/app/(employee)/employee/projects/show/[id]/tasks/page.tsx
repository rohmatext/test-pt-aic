'use client';
import { useMessage } from '@/components/context/message-context';
import InputError from '@/components/input-error';
import Loader from '@/components/loader';
import { BlockStack, Page, TitleBar } from '@/components/page';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import axios from '@/lib/axios';
import { ErrorBag } from '@/types';
import { Task } from '@/types/task';
import { format, parse } from 'date-fns';
import Cookies from 'js-cookie';
import { CalendarIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TasksPage() {
    const { onMessage } = useMessage();

    const router = useRouter();
    const params = useParams();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorBag>(Object.assign({}));

    const [data, setStateData] = useState<Omit<Task, 'id' | 'user_id' | 'project_id' | 'created_at' | 'updated_at'>>(
        Object.assign({
            task_date: '',
            description: '',
            hours: 0,
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
            .post(`/api/projects/${params.id}/tasks`, data, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            })
            .then((res) => {
                onMessage('success', 'Task berhasil ditambahkan');
                router.push(`/employee/projects/show/${params.id}`);
            })
            .catch((err) => {
                setErrors(err.response.data.errors);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Page maxWidth="sm">
            <TitleBar title="Tambah Task" navigation={`/employee/projects/show/${params.id}`} />
            <BlockStack>
                <Card>
                    <CardContent>
                        <BlockStack>
                            <BlockStack className="gap-2">
                                <Label>Tanggal</Label>
                                <DatePicker onDateChange={(date?: string) => setData('task_date', date || '')} />
                                <InputError message={errors.task_date} />
                            </BlockStack>
                            <BlockStack className="gap-2">
                                <Label>Deskripsi</Label>
                                <Textarea onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} />
                            </BlockStack>
                            <BlockStack className="gap-2">
                                <Label>Total Jam</Label>
                                <Select onValueChange={(value) => setData('hours', value)} defaultValue={data.role}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih jumlah jam" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 24 }, (_, i) => i + 1).map((hour) => (
                                            <SelectItem key={hour} value={hour.toString()}>{`${hour} Jam`}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.hours} />
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

type DatePickerProps = {
    defaultValue?: string;
    onDateChange?: (date?: string) => void;
};

const DatePicker = ({ defaultValue, onDateChange }: DatePickerProps) => {
    const [date, setDate] = useState<Date | undefined>(defaultValue ? parse(defaultValue, 'yyyy-MM-dd', new Date()) : undefined);
    const [isOpen, setIsOpen] = useState(false);

    const handleDateSelect = (day?: Date) => {
        const selectedDate = day || (date as Date);
        setDate(selectedDate);
        setIsOpen(false);

        if (onDateChange) {
            onDateChange(format(selectedDate, 'yyyy-MM-dd'));
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant={'outline'} className={`w-full justify-start text-left font-normal ${!date && 'text-muted-foreground'}`}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'dd MMM yyyy') : <span>Pilih tanggal</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
        </Popover>
    );
};
