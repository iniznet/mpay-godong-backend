import Api from './Api';

const MutasiTabunganApi = {
    getMutasiTabungans: (params) => Api.get('/mutasi-tabungan', { params }),
    getMutasiTabungan: (id) => Api.get(`/mutasi-tabungan/${id}`),
    getNextFaktur: () => Api.get('/mutasi-tabungan/next-faktur'),
    createMutasiTabungan: (mutasiTabunganData) => Api.post('/mutasi-tabungan', mutasiTabunganData),
    updateMutasiTabungan: (id, mutasiTabunganData) => Api.put(`/mutasi-tabungan/${id}`, mutasiTabunganData),
    deleteMutasiTabungan: (id) => Api.delete(`/mutasi-tabungan/${id}`),
    deleteMultipleMutasiTabungans: (ids) => Api.post('/mutasi-tabungan/delete-multiple', { ids }),
};

export default MutasiTabunganApi;
