import Api from "./Api";

const TabunganApi = {
    getTabungans: (params) => Api.get('/tabungan', { params }),
    getTabungan: (id) => Api.get(`/tabungan/${id}`),
    createTabungan: (tabunganData) => Api.post('/tabungan', tabunganData),
    updateTabungan: (id, tabunganData) => Api.put(`/tabungan/${id}`, tabunganData),
    deleteTabungan: (id) => Api.delete(`/tabungan/${id}`),
    deleteMultipleTabungans: (ids) => Api.post('/tabungan/delete-multiple', { ids }),
};

export default TabunganApi;
