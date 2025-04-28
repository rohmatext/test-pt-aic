import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'> {
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
}

export function CurrencyInput({ value, defaultValue = 0, onChange, className, ...props }: CurrencyInputProps) {
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = React.useState<number>(defaultValue);
    const [isFocused, setIsFocused] = React.useState(false);

    const currentValue = isControlled ? value : internalValue;
    const [displayValue, setDisplayValue] = React.useState<string>(currentValue.toString());

    const formatCurrency = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    const handleFocus = () => {
        setIsFocused(true);
        setDisplayValue(currentValue.toString());
    };

    const handleBlur = () => {
        setIsFocused(false);
        setDisplayValue(formatCurrency(currentValue));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        const numericValue = parseInt(raw || '0', 10);

        if (!isControlled) {
            setInternalValue(numericValue);
        }

        onChange?.(numericValue); // dipanggil kalau ada
        setDisplayValue(raw);
    };

    return (
        <Input
            {...props}
            type="text"
            value={isFocused ? displayValue : formatCurrency(currentValue)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(className)}
        />
    );
}
