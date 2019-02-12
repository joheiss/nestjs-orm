export interface OrganizationDTO {
    id: string;
    objectType?: string;
    status?: number;
    isDeletable?: boolean;
    name: string;
    timezone: string;
    parentId?: string;
}
