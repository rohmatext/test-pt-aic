interface Remuneration {
    user_id: number;
    user: User;
    hourly_rate: string;
    hours_spent: number;
    base_fee: number;
    additional_fees: AdditionalFees;
    total_fee: string;
}

interface AdditionalFees {
    user: number;
    group: Group;
    total: string;
}

interface Group {
    member_count: number;
    total: string;
    per_member: string;
}

export { Remuneration };
