import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React, { ComponentPropsWithoutRef, ElementType } from 'react';

interface TitleBarProps {
    action?: React.ReactNode;
    title?: string;
    subtitle?: string;
    navigation?: string;
    children?: React.ReactNode;
    titleMetadata?: React.ReactNode;
}

const TitleBar: React.FC<TitleBarProps> = ({ title, subtitle, navigation, children, titleMetadata }) => {
    const classes = cn(typeof navigation === 'string' ? "grid [grid-template-areas:'navigation_action'_'title_title'] md:flex" : 'flex');

    return (
        <div className="relative py-4">
            <div className={cn(`col-[auto_1fr] content-center items-center gap-y-2 md:gap-x-2`, classes, subtitle ? 'content-start' : '')}>
                {navigation && (
                    <div className="[grid-area:navigation]">
                        <Link href={navigation}>
                            <Button variant="ghost" size="icon" className="p-0 [&_svg]:size-5">
                                <ArrowLeft />
                            </Button>
                        </Link>
                    </div>
                )}
                <div className="[grid-area:title]">
                    <div className="flex items-center gap-2">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">{title}</h2>
                        {titleMetadata}
                    </div>
                    {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
                </div>

                {children && (
                    <div className="flex flex-auto items-center justify-end whitespace-nowrap [grid-area:action]">
                        <div>{children}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Page = ({ className, maxWidth, ...props }: React.ComponentProps<'div'> & { maxWidth?: PageVariants['maxWidth'] }) => {
    return (
        <div {...props} className={cn(pageVariants({ maxWidth }), className)}>
            <React.Fragment>{props.children}</React.Fragment>
        </div>
    );
};

type BlockStackProps<T extends ElementType> = {
    as?: T;
    className?: string;
} & BlockStackVariants &
    ComponentPropsWithoutRef<T>;

const BlockStack = <T extends ElementType = 'div'>({ as, align, inlineAlign, className, ...props }: BlockStackProps<T>) => {
    const Component = as || 'div';
    const classes = blockStackVariants({ align, inlineAlign });

    return <Component className={cn(classes, className)} {...props} />;
};

export type BlockStackVariants = VariantProps<typeof blockStackVariants>;
export type PageVariants = VariantProps<typeof pageVariants>;

const blockStackVariants = cva('flex flex-col gap-4', {
    variants: {
        align: {
            default: '[align-items:initial]',
            start: 'items-start',
            end: 'items-end',
            center: 'items-center',
            baseline: 'items-baseline',
            stretch: 'items-stretch',
        },
        inlineAlign: {
            default: '[justify-content:initial]',
            start: 'justify-start',
            center: 'justify-center',
            end: 'justify-end',
            stretch: 'justify-stretch',
        },
    },
    defaultVariants: {
        align: 'default',
        inlineAlign: 'default',
    },
});

const pageVariants = cva('mx-auto w-full', {
    variants: {
        maxWidth: {
            default: 'max-w-full',
            sm: 'max-w-screen-sm',
            md: 'max-w-screen-md',
            lg: 'max-w-screen-lg',
            xl: 'max-w-screen-xl',
            '2xl': 'max-w-screen-2xl',
        },
    },
    defaultVariants: {
        maxWidth: 'default',
    },
});

export { BlockStack, blockStackVariants, Page, pageVariants, TitleBar };
