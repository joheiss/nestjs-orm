export interface UserDTO {
    readonly id: string;
    readonly objectType?: string;
    readonly organization?: string;
    readonly roles?: string[];
    readonly token?: string;
}
