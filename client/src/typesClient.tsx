export interface ProfileInfo {
    id: number;
    name: string;
    surname: string;
    photourl: string;
}

export interface ProfileInfoWBio extends ProfileInfo {
    bio?: string[];
}

export interface EmptyProps {}

export interface ChatInfo {
    id: number;
    name: string;
    surname: string;
    message: string;
    send_at: string;
    photourl?: string;
}
