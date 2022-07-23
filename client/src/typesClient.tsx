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
    user_id: number;
    name: string;
    surname: string;
    message: string;
    send_at: string;
    photourl?: string;
}

export interface PostId {
    post_id: number;
}
