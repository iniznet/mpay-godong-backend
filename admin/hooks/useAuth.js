import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthApi from '../services/AuthApi';

export function useAuth(requiredRole = 'admin') {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await AuthApi.getCurrentUser();
                const user = response.data.user;

                if (user.role !== requiredRole) {
                    throw new Error('Insufficient permissions');
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error('Authentication error:', error);
                router.push('/auth/login');
            } finally {
                setIsLoading(false);
            }
        }

        checkAuth();
    }, [router, requiredRole]);

    return { isAuthenticated, isLoading };
}