'use client';

import { useMessage } from '@/components/context/message-context';
import InputError from '@/components/input-error';
import Loader from '@/components/loader';
import { BlockStack, Page, TitleBar } from '@/components/page';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import axios from '@/lib/axios';
import { ErrorBag } from '@/types';
import { Project } from '@/types/project';
import { CheckedState } from '@radix-ui/react-checkbox';
import { format, parse } from 'date-fns';
import Cookies from 'js-cookie';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProjectCreatePage() {
    const { onMessage } = useMessage();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorBag>(Object.assign({}));

    const [withEndDate, setWithEndDate] = useState<CheckedState>(false);

    const [data, setStateData] = useState<Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>>(
        Object.assign({
            title: '',
            description: '',
            start_date: '',
            end_date: '',
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
            .post('/api/projects', data, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            })
            .then((res) => {
                onMessage('success', res.data.message);
                router.push('/admin/projects');
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
            <TitleBar title="Tambah Proyek" navigation="/admin/projects" />
            <BlockStack>
                <Card>
                    <CardContent>
                        <BlockStack>
                            <BlockStack className="gap-2">
                                <Label>Judul</Label>
                                <Input onChange={(e) => setData('title', e.target.value)} />
                                <InputError message={errors.title} />
                            </BlockStack>

                            <BlockStack className="gap-2">
                                <Label>Tanggal Mulai</Label>
                                <DatePicker onDateChange={(date?: string) => setData('start_date', date || '')} />
                                <InputError message={errors.title} />
                            </BlockStack>

                            <BlockStack className="gap-2">
                                <Label className="text-muted-foreground text-sm leading-none">
                                    <Checkbox
                                        onCheckedChange={(isChecked) => {
                                            setWithEndDate(isChecked);
                                            setData('end_date', '');
                                        }}
                                    />
                                    <span>Set Estimasi Tanggal Selesai</span>
                                </Label>
                            </BlockStack>

                            {withEndDate && (
                                <BlockStack className="gap-2">
                                    <Label>Estimasi Tanggal Selesai</Label>
                                    <DatePicker onDateChange={(date?: string) => setData('end_date', date || '')} />
                                    <InputError message={errors.title} />
                                </BlockStack>
                            )}

                            <BlockStack className="gap-2">
                                <Label>Deskripsi (optional)</Label>
                                <Textarea onChange={(e) => setData('description', e.target.value)} />
                                <InputError message={errors.description} />
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
