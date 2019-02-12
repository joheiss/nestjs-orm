export interface ReceiverDTO {
    id?: number;
    objectType?: string;
    organization: string;
    isDeletable?: boolean;
    status?: number;
    name: string;
    nameAdd?: string;
    country: string;
    postalCode?: string;
    city?: string;
    street?: string;
    email?: string;
    phone?: string;
    fax?: string;
    webSite?: string;
}
