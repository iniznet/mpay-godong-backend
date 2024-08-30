import Api from './Api';

const BalanceApi = {
    getBalances: (params) => Api.get('/balances', { params }),
    getBalance: (id) => Api.get(`/balances/${id}`),
    createBalance: (balanceData) => Api.post('/balances', balanceData),
    updateBalance: (id, balanceData) => Api.put(`/balances/${id}`, balanceData),
    deleteBalance: (id) => Api.delete(`/balances/${id}`),
    deleteMultipleBalances: (ids) => Api.post('/balances/delete-multiple', { ids }),
};

export default BalanceApi;