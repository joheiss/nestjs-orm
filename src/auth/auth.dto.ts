export interface AuthDTO {
    readonly id: string;
    readonly organization: string;
    readonly roles: string[];
    readonly token?: string;
}
