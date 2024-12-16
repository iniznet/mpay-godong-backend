'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import { LayoutContext } from '../../layout/context/layoutcontext';
import DashboardApi from '@/services/DashboardApi';

const Dashboard = () => {
    const [lineOptions, setLineOptions] = useState({});
    const { layoutConfig } = useContext(LayoutContext);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [summary, setSummary] = useState({});
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [topDebtors, setTopDebtors] = useState([]);
    const [salesOverview, setSalesOverview] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };
        setLineOptions(lineOptions);
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            const summaryData = await DashboardApi.getSummary();
            const transactionsData = await DashboardApi.getRecentTransactions();
            const debtorsData = await DashboardApi.getTopProducts();
            const salesData = await DashboardApi.getSalesOverview();
            const notificationsData = await DashboardApi.getNotifications();

            setSummary(summaryData.data);
            setRecentTransactions(transactionsData.data);
            setTopDebtors(debtorsData.data);
            setSalesOverview(salesData.data);
            setNotifications(notificationsData.data);
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value) => {
        return value?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    const lineData = {
        labels: salesOverview?.map(item => item.Wilayah) || [],
        datasets: [
            {
                label: 'Total Pinjaman',
                data: salesOverview?.map(item => item.TotalPinjaman) || [],
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: 0.4
            }
        ]
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Nasabah</span>
                            <div className="text-900 font-medium text-xl">{summary.totalNasabah}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-user text-blue-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{summary.newNasabah} baru </span>
                    <span className="text-500">sejak bulan lalu</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Tabungan</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(summary.totalTabungan)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-map-marker text-orange-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{formatCurrency(summary.newTabungan)} </span>
                    <span className="text-500">sejak bulan lalu</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Debitur</span>
                            <div className="text-900 font-medium text-xl">{summary.totalDebitur}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-inbox text-cyan-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{summary.newDebitur} </span>
                    <span className="text-500">baru bulan ini</span>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Angsuran</span>
                            <div className="text-900 font-medium text-xl">{formatCurrency(summary.totalAngsuran)}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-comment text-purple-500 text-xl" />
                        </div>
                    </div>
                    <span className="text-green-500 font-medium">{formatCurrency(summary.newAngsuran)} </span>
                    <span className="text-500">bulan ini</span>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Transaksi Terbaru</h5>
                    <DataTable value={recentTransactions} rows={5} paginator responsiveLayout="scroll">
                        <Column field="Tgl" header="Tanggal" body={(data) => new Date(data.Tgl).toLocaleDateString()} />
                        <Column field="Rekening" header="Rekening" />
                        <Column field="Keterangan" header="Keterangan" />
                        <Column field="Jumlah" header="Jumlah" body={(data) => formatCurrency(data.Jumlah)} />
                    </DataTable>
                </div>
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Debitur Teratas</h5>
                    </div>
                    <ul className="list-none p-0 m-0">
                        {topDebtors.map((debtor, i) => (
                            <li key={debtor.ID} className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                                <div>
                                    <span className="text-900 font-medium mr-2 mb-1 md:mb-0">{debtor.nasabah.Nama}</span>
                                    <div className="mt-1 text-600">{debtor.Rekening} - {debtor.NoPengajuan}</div>
                                </div>
                                <div className="mt-2 md:mt-0 flex align-items-center">
                                    <div className="surface-300 border-round overflow-hidden w-10rem lg:w-6rem" style={{ height: '8px' }}>
                                        <div className={`bg-${['orange', 'cyan', 'pink', 'green', 'indigo'][i]}-500 h-full`} style={{ width: '50%' }} />
                                    </div>
                                    <span className="text-orange-500 ml-3 font-medium">{formatCurrency(debtor.Plafond)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Distribusi Pinjaman per Wilayah</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>

                <div className="card">
                    <div className="flex align-items-center justify-content-between mb-4">
                        <h5>Notifikasi Terbaru</h5>
                    </div>

                    <ul className="p-0 mx-0 mt-0 mb-4 list-none">
                        {notifications.map((notification, index) => (
                            <li key={index} className="flex align-items-center py-2 border-bottom-1 surface-border">
                                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                    <i className="pi pi-dollar text-xl text-blue-500" />
                                </div>
                                <span className="text-900 line-height-3">
                                    {notification.title}
                                    <span className="text-700"> {notification.description}</span>
                                    <small className="text-500 block">{notification.date}</small>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
