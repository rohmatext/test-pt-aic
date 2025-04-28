import { clsx, type ClassValue } from 'clsx';
import { format, isValid, parse } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateStr?: string): string | null {
    if (!dateStr) {
        return null;
    }
    const date = new Date(dateStr);
    return format(date, 'dd MMM yyyy');
}

export function parseDate(dateString: string | null | undefined): Date | null {
    if (!dateString) {
        return null;
    }

    const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());

    return isValid(parsedDate) ? parsedDate : null;
}

export function formatCurrency(number: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
}
