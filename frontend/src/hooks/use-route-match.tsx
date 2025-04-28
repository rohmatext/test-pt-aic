'use client';
import { usePathname } from 'next/navigation';

export function useRouteMatch(pattern?: string | null) {
    if (!pattern) return false;

    const pathname = usePathname();

    const regexPattern = '^' + pattern.replace(/\/\*$/, '(/.*)?').replace(/\*/g, '.*') + '$';
    const regex = new RegExp(regexPattern);

    return regex.test(pathname);
}
