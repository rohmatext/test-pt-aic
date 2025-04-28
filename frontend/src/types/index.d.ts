export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    active?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface Auth {
    user: User;
}

export interface ErrorBag {
    [key: string]: string | string[];
}

export interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
