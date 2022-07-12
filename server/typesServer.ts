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

export interface UserResetPassword {
    email: string;
    code: string;
    newPassword: string;
}

export type StringObject = NewUserRegistration | LogInUser | UserResetPassword;

export interface UserLoggingIn extends NewUserRegistration {
    id: number;
}

export type LogInResponse = string | UserBasicInfo | QueryResult;
export type RegisterResponse = UserBasicInfo | QueryResult;

export type MultiResponseSuccess = string | [];
export type SingleResponseSuccess = string | {};

export type ProcessMultiRes = MultiResponseSuccess | QueryResult;
export type ProcessSingleRes = SingleResponseSuccess | QueryResult;

// import { Request } from "express";
// export interface IFileRequest extends Request {
//     file: string; // or any other type
// }
