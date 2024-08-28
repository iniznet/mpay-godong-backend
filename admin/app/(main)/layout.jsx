'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../layout/layout';
import AuthApi from '../../services/AuthApi';

export default function AppLayout({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await AuthApi.getCurrentUser();

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

    return <Layout>{children}</Layout>;
}