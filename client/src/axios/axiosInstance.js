import axios from 'axios';
import { store } from '../store/store';
import { setAuthState } from '../features/userSlice';
import { toast } from 'react-toastify';

const url = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
    baseURL: url,
    withCredentials: true // to access cookies
});

// Response interceptor to handle token expiration / 401 unauthorized
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const originalUrl = error.config?.url || '';
            // Do not trigger session expiry toast if it was a login attempt failure
            if (!originalUrl.includes('/auth/login')) {
                const state = store.getState();
                if (state.user?.isLoggedin) {
                    store.dispatch(setAuthState({
                        isLoggedin: false,
                        authUser: null
                    }));
                    toast.warn('Session expired. Please log in again.', {
                        toastId: 'session-expired'
                    });
                }
            }
        }
        return Promise.reject(error);
    }
);