import Api from './Api';

const AngsuranApi = {
    getAngsurans: (params) => Api.get('/angsuran', { params }),
    getAngsuran: (id) => Api.get(`/angsuran/${id}`),
    getNextFaktur: () => Api.get('/angsuran/next-faktur'),
    createAngsuran: (angsuranData) => Api.post('/angsuran', angsuranData),
    updateAngsuran: (id, angsuranData) => Api.put(`/angsuran/${id}`, angsuranData),
    deleteAngsuran: (id) => Api.delete(`/angsuran/${id}`),
    deleteMultipleAngsurans: (ids) => Api.post('/angsuran/delete-multiple', { ids }),
};

export default AngsuranApi;
