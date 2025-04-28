interface Task {
    id: number;
    project_id: number;
    user_id: number;
    task_date: string;
    hours: number;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export { Task };
