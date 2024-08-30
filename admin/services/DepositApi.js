import Api from './Api';

const DepositApi = {
    getDeposits: (params) => Api.get('/deposits', { params }),
    getDeposit: (id) => Api.get(`/deposits/${id}`),
    createDeposit: (depositData) => Api.post('/deposits', depositData),
    updateDeposit: (id, depositData) => Api.put(`/deposits/${id}`, depositData),
    deleteDeposit: (id) => Api.delete(`/deposits/${id}`),
    deleteMultipleDeposits: (ids) => Api.post('/deposits/delete-multiple', { ids }),
};

export default DepositApi;