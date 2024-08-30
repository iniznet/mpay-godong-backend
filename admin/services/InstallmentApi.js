import Api from './Api';

const InstallmentApi = {
    getInstallments: (params) => Api.get('/installments', { params }),
    getInstallment: (id) => Api.get(`/installments/${id}`),
    createInstallment: (installmentData) => Api.post('/installments', installmentData),
    updateInstallment: (id, installmentData) => Api.put(`/installments/${id}`, installmentData),
    deleteInstallment: (id) => Api.delete(`/installments/${id}`),
    deleteMultipleInstallments: (ids) => Api.post('/installments/delete-multiple', { ids }),
};

export default InstallmentApi;