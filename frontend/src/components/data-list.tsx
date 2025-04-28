import { cn } from '@/lib/utils';

interface DataListProps extends React.ComponentProps<'div'> {
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}

interface DataListItemProps extends React.ComponentProps<'li'> {
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
}

function DataList({ children, className, ...props }: DataListProps) {
    return (
        <div className="relative w-full overflow-auto" {...props}>
            <ul className={cn('w-full text-sm', className)}>{children}</ul>
        </div>
    );
}

function DataListItem({ children, className, ...props }: DataListItemProps) {
    return (
        <li className={cn('flex items-center justify-between py-4', className)} {...props}>
            {children}
        </li>
    );
}

function DataListHeader({ children, className, ...props }: DataListItemProps) {
    return (
        <DataListItem className={cn('text-muted-foreground h-10 p-2 text-left font-medium', className)} {...props}>
            {children}
        </DataListItem>
    );
}

function DataListEmpty({ children, className, ...props }: DataListProps) {
    return (
        <DataList className={cn('text-foreground p-4 align-middle text-sm whitespace-nowrap', className)} {...props}>
            <li className={cn('flex items-center justify-between py-4')}>
                <div className="flex flex-1 items-center justify-center py-10">{children}</div>
            </li>
        </DataList>
    );
}

export { DataList, DataListEmpty, DataListHeader, DataListItem };

export type { DataListItemProps, DataListProps };
