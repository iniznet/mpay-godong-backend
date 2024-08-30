import Api from './Api';

const DebtApi = {
    getDebts: (params) => Api.get('/debts', { params }),
    getDebt: (id) => Api.get(`/debts/${id}`),
    createDebt: (debtData) => Api.post('/debts', debtData),
    updateDebt: (id, debtData) => Api.put(`/debts/${id}`, debtData),
    deleteDebt: (id) => Api.delete(`/debts/${id}`),
    deleteMultipleDebts: (ids) => Api.post('/debts/delete-multiple', { ids }),
};

export default DebtApi;