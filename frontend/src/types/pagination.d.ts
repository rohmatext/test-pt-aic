interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

interface MetaLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: MetaLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

interface PaginationResponse<T> {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
    message: string;
}

export { MetaLink, PaginationLinks, PaginationMeta, PaginationResponse };
