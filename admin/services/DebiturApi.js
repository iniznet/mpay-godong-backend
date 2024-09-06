import Api from './Api';

const DebiturApi = {
    getDebiturs: (params) => Api.get('/debitur', { params }),
    getDebitur: (id) => Api.get(`/debitur/${id}`),
    getNextFaktur: () => Api.get('/debitur/next-faktur'),
    createDebitur: (debiturData) => Api.post('/debitur', debiturData),
    updateDebitur: (id, debiturData) => Api.put(`/debitur/${id}`, debiturData),
    deleteDebitur: (id) => Api.delete(`/debitur/${id}`),
    deleteMultipleDebiturs: (ids) => Api.post('/debitur/delete-multiple', { ids }),
};

export default DebiturApi;
