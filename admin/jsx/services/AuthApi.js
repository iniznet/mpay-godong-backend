import Api from './Api';
const AuthApi = {
    login: (credentials) => Api.post('/login', credentials),
    register: (credentials) => Api.post('/register', credentials),
    logout: () => Api.post('/logout'),
    refresh: () => Api.post('/refresh'),
    getCurrentUser: () => Api.get('/user'),
};
export default AuthApi;
