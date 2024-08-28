// services/Api.ts
import axios from 'axios';
import AuthApi from './AuthApi';
import { removeCookie, setCookie } from 'typescript-cookie';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const Api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
Api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});
Api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshResponse = await AuthApi.refresh();
            const newToken = refreshResponse.data.authorisation.token;
            localStorage.setItem('token', newToken);
            setCookie('token', newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return Api(originalRequest);
        }
        catch (refreshError) {
            localStorage.removeItem('token');
            removeCookie('token');
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
export default Api;
