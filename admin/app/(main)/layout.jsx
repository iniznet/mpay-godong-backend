'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../layout/layout';
import AuthApi from '../../services/AuthApi';
import { UserProvider } from '../../context/userContext';

export default function AppLayout({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await AuthApi.getCurrentUser();
                // Update this line to correctly set the user data
                setUser(response.data.user);
                setIsLoading(false);
            } catch (error) {
                console.error('Authentication error:', error);
                router.push('/auth/login');
            }
        }

        checkAuth();
    }, [router]);

    if (isLoading) {
        return <div>
            <div className="flex align-items-center justify-content-center min-h-screen">
                <i className="pi pi-spin pi-spinner text-6xl text-blue-300"></i>
            </div>
        </div>
    }

    return (
        <UserProvider value={{ user, setUser }}>
            <Layout>{children}</Layout>
        </UserProvider>
    );
}