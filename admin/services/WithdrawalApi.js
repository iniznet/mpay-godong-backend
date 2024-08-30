import Api from './Api';

const WithdrawalApi = {
    getWithdrawals: (params) => Api.get('/withdrawals', { params }),
    getWithdrawal: (id) => Api.get(`/withdrawals/${id}`),
    createWithdrawal: (withdrawalData) => Api.post('/withdrawals', withdrawalData),
    updateWithdrawal: (id, withdrawalData) => Api.put(`/withdrawals/${id}`, withdrawalData),
    deleteWithdrawal: (id) => Api.delete(`/withdrawals/${id}`),
    deleteMultipleWithdrawals: (ids) => Api.post('/withdrawals/delete-multiple', { ids }),
};

export default WithdrawalApi;