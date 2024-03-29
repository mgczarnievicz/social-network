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
    sender_id: number;
    receiver_id?: number;
    name: string;
    surname: string;
    message: string;
    send_at: string;
    photourl?: string;
}

export interface PrivateChatInfo {
    id: number;
    receiver_name: string;
    receiver_surname: string;
    sender_name: string;
    sender_surname: string;
    message: string;
    send_at: string;
    photourl?: string;
}

export interface PostId {
    post_id: number;
}

export interface CommentsId {
    comment_id: number;
    post_id: number;
}
export interface CommentsObject {
    [key: number]: Array<CommentsId>;
}

export const GeneralChat: ProfileInfo = {
    id: 0,
    name: "General",
    surname: "Chat",
    photourl: "/toAll.png",
};
