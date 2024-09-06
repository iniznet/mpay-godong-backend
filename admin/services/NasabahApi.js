import Api from './Api';

const NasabahApi = {
    getNasabahs: (params) => Api.get('/nasabah', { params }),
    getNasabah: (id) => Api.get(`/nasabah/${id}`),
    createNasabah: (nasabahData) => Api.post('/nasabah', nasabahData),
    updateNasabah: (id, nasabahData) => Api.put(`/nasabah/${id}`, nasabahData),
    deleteNasabah: (id) => Api.delete(`/nasabah/${id}`),
    deleteMultipleNasabahs: (ids) => Api.post('/nasabah/delete-multiple', { ids }),
};

export default NasabahApi;
