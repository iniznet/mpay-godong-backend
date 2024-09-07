import Api from './Api';

const DashboardApi = {
    getSummary: () => Api.get('/dashboard/summary'),
    getRecentTransactions: () => Api.get('/dashboard/recent-transactions'),
    getTopProducts: () => Api.get('/dashboard/top-products'),
    getSalesOverview: () => Api.get('/dashboard/sales-overview'),
    getNotifications: () => Api.get('/dashboard/notifications'),
};

export default DashboardApi;