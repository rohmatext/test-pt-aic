interface Project {
    id: number;
    user_id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export { Project };
