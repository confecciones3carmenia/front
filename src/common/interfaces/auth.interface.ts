export interface AuthResponse {
    auth:  Auth;
    token: string;
}

export interface AuthSuccessResponse {
    ok: boolean;
    user: Auth | undefined;
    token: string;
}

export interface AuthErrorResponse {
    ok: boolean;
    message: string;
}

export interface Auth {
    _id:      string;
    userName: string;
    email:    string;
    isActive: boolean;
    user:     UserAuth;
}

export interface UserAuth {
    _id:       string;
    name:      string;
    lastname:  string;
    position:  string;
    role:      RoleAuth;
    createdAt: Date;
    updatedAt: Date;
    __v:       number;
}

export interface RoleAuth {
    _id:  string;
    name: string;
}

export interface Login {
    email: string;
    password: string;
}
