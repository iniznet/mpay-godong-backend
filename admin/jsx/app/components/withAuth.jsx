import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'next/router';
export function withAuth(WrappedComponent, requiredRole = 'admin') {
    return function AuthenticatedComponent(props) {
        const { isAuthenticated, isLoading } = useAuth(requiredRole);
        const router = useRouter();
        if (isLoading) {
            return <div>Loading...</div>;
        }
        if (!isAuthenticated) {
            router.push('/auth/login');
            return null;
        }
        return <WrappedComponent {...props}/>;
    };
}
