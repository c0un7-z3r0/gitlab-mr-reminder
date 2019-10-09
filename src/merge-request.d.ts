export interface IUser {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
}

export interface ITimeStats {
    time_estimate: number;
    total_time_spent: number;
    human_time_estimate?: number;
    human_total_time_spent?: number;
}

export interface ITaskCompletionStatus {
    count: number;
    completed_count: number;
}

export interface IMergeRequest {
    id: number;
    iid: number;
    project_id: number;
    title: string;
    description: string;
    state: string;
    created_at: Date;
    updated_at: Date;
    merged_by?: Date;
    merged_at?: Date;
    closed_by?: Date;
    closed_at?: Date;
    target_branch: string;
    source_branch: string;
    user_notes_count: number;
    upvotes: number;
    downvotes: number;
    assignee?: IUser;
    author: IUser;
    assignees: IUser[];
    source_project_id: number;
    target_project_id: number;
    labels?: string[];
    work_in_progress: boolean;
    milestone?: any;
    merge_when_pipeline_succeeds: boolean;
    merge_status: string;
    sha: string;
    merge_commit_sha?: string;
    discussion_locked?: boolean;
    should_remove_source_branch?: boolean;
    force_remove_source_branch: boolean;
    reference: string;
    web_url: string;
    time_stats: ITimeStats;
    squash: boolean;
    task_completion_status: ITaskCompletionStatus;
    approvals_before_merge?: boolean;
}

export interface SuggestedApprover {
    id: number;
    name: string;
    username: string;
    state: string;
    avatar_url: string;
    web_url: string;
}

export interface ApprovalRulesLeft {
    id: any;
    name: string;
    rule_type: string;
}

export interface Approval {
    id: number;
    iid: number;
    project_id: number;
    title: string;
    description: string;
    state: string;
    created_at: Date;
    updated_at: Date;
    merge_status: string;
    approved: boolean;
    approvals_required: number;
    approvals_left: number;
    require_password_to_approve?: any;
    approved_by: any[];
    suggested_approvers: SuggestedApprover[];
    approvers: any[];
    approver_groups: any[];
    user_has_approved: boolean;
    user_can_approve: boolean;
    approval_rules_left: ApprovalRulesLeft[];
    has_approval_rules: boolean;
    merge_request_approvers_available: boolean;
    multiple_approval_rules_available: boolean;
}
