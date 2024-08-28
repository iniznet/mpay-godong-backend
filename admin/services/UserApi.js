import Api from './Api';

const UserApi = {
    getUsers: (params) => Api.get('/users', { params }),
    getUser: (id) => Api.get(`/users/${id}`),
    createUser: (userData) => Api.post('/users', userData),
    updateUser: (id, userData) => Api.put(`/users/${id}`, userData),
    deleteUser: (id) => Api.delete(`/users/${id}`),
    deleteMultipleUsers: (ids) => Api.post('/users/delete-multiple', { ids }),
};

export default UserApi;