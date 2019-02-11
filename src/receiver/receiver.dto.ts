export interface ReceiverDTO {
    id: string;
    objectType: string;
    organization: string;
    isDeleteable: boolean;
    status: number;
    name: string;
    nameAdd?: string;
    country: string;
    postalCode: string;
    city: string;
    street?: string;
    email: string;
    phone?: string;
    fax?: string;
    webSite?: string;
}
