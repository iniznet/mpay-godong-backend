import Api from "./Api";

const DashboardApi = {
    getDashboardData: () => Api.get('/dashboard/data'),
    getNasabahCount: () => Api.get('/dashboard/nasabah-count'),
    getTabunganTotal: () => Api.get('/dashboard/tabungan-total'),
    getRecentMutasi: () => Api.get('/dashboard/recent-mutasi'),
    getDebiturTotal: () => Api.get('/dashboard/debitur-total'),
    getAngsuranTotal: () => Api.get('/dashboard/angsuran-total'),
    getTabunganTrend: () => Api.get('/dashboard/tabungan-trend'),
    getDebiturDistribution: () => Api.get('/dashboard/debitur-distribution'),
    getTopNasabah: () => Api.get('/dashboard/top-nasabah'),
    getTransactionSummary: () => Api.get('/dashboard/transaction-summary'),
};

export default DashboardApi;
