import axios from 'axios';

export interface UserBase {
    email: string;
    name?: string;
    goal?: string;
    resumes?: string;
    sync_enabled?: boolean;
    sync_frequency?: string;
    sync_region?: string;
    sync_limit?: number;
    invite_code?: string;
    tier?: string;
    is_admin?: boolean;
}

export interface UserResponse extends UserBase {
    id: number;
    is_verified?: boolean;
}

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we receive a 403 Forbidden globally and we're not hitting a sync endpoint,
    // redirect the user to the invite screen (as we only support invited users).
    if (error.response?.status === 403 && typeof window !== 'undefined') {
        const url = error.config?.url || '';
        if (!url.includes('/sync-and-fetch')) {
            window.location.href = '/invite';
        }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
    // Upserts a user and sends OTP
    loginOrSignup: async (userData: UserBase): Promise<UserResponse> => {
        const response = await api.post('/user', userData);
        return response.data;
    },
    
    verifyOtp: async (email: string, otp: string): Promise<UserResponse> => {
        // FastAPI endpoint expects query params for this one based on router: `email: EmailStr, otp: str`
        const response = await api.post('/verify-otp', null, {
            params: { email, otp }
        });
        return response.data;
    },

    resendOtp: async (email: string): Promise<{ status: string, message: string }> => {
        const response = await api.post('/resend-otp', null, {
            params: { email }
        });
        return response.data;
    },

    getUser: async (userId: number): Promise<UserResponse> => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },
    
    updateUser: async (userId: number, updateData: Partial<UserBase>): Promise<UserResponse> => {
        const response = await api.put(`/users/${userId}`, updateData);
        return response.data;
    }
};
