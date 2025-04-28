interface AdditionalFee {
    id: number;
    project_id: number;
    description: string;
    amount: number;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export { AdditionalFee };
