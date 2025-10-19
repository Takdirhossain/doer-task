export interface User {
    id: string;
    username: string;
    email: string;
    mobileNumber: string;
    role: string;
    status: string;
    createdAt: string;  
    updatedAt: string;  
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
    };
}

export interface SignUpModel {
    username: string;
    email: string;
    mobileNumber: string;
    password: string;
}