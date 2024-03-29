import { QueryResult } from "pg";

export interface NewUserRegistration {
    name: string;
    surname: string;
    email: string;
    password: string;
}

export interface LogInUser {
    email: string;
    password: string;
}

export interface UserBasicInfo {
    id: number;
    name: string;
    surname: string;
}

export interface UserInfo extends UserBasicInfo {
    photoUrl: string;
    bio: string;
    email: string;
}

export interface FriendInfo extends UserBasicInfo {
    photoUrl: string;
}

export interface FriendShipResponds {
    button: string;
    viewUserId: number;
}

export interface UserResetPassword {
    email: string;
    code: string;
    newPassword: string;
}

export interface UsersOnlineInfo {
    id: number;
    name: string;
    surname: string;
    photourl: string;
}

export type StringObject = NewUserRegistration | LogInUser | UserResetPassword;

export interface UserLoggingIn extends NewUserRegistration {
    id: number;
}

export type LogInResponse = string | UserBasicInfo | QueryResult;
export type RegisterResponse = UserBasicInfo | QueryResult;
