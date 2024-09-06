'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DashboardApi from '@/services/DashboardApi';

const Dashboard = () => {
    const [nasabahCount, setNasabahCount] = useState(0);
    const [tabunganTotal, setTabunganTotal] = useState(0);
    const [recentMutasi, setRecentMutasi] = useState([]);
    const [debiturTotal, setDebiturTotal] = useState(0);
    const [angsuranTotal, setAngsuranTotal] = useState(0);
    const [tabunganTrend, setTabunganTrend] = useState([]);
    const [debiturDistribution, setDebiturDistribution] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [
                nasabahCountRes,
                tabunganTotalRes,
                recentMutasiRes,
                debiturTotalRes,
                angsuranTotalRes,
                tabunganTrendRes,
                debiturDistributionRes
            ] = await Promise.all([
                DashboardApi.getNasabahCount(),
                DashboardApi.getTabunganTotal(),
                DashboardApi.getRecentMutasi(),
                DashboardApi.getDebiturTotal(),
                DashboardApi.getAngsuranTotal(),
                DashboardApi.getTabunganTrend(),
                DashboardApi.getDebiturDistribution()
            ]);

            setNasabahCount(nasabahCountRes.data);
            setTabunganTotal(tabunganTotalRes.data);
            setRecentMutasi(recentMutasiRes.data);
            setDebiturTotal(debiturTotalRes.data);
            setAngsuranTotal(angsuranTotalRes.data);
            setTabunganTrend(tabunganTrendRes.data);
            setDebiturDistribution(debiturDistributionRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    };

    const tabunganTrendOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Tabungan Trend',
            },
        },
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <Card title="Total Nasabah" className="mb-0">
                    <div className="text-center">
                        <span className="text-5xl font-bold">{nasabahCount}</span>
                    </div>
                </Card>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <Card title="Total Tabungan" className="mb-0">
                    <div className="text-center">
                        <span className="text-5xl font-bold">{formatCurrency(tabunganTotal)}</span>
                    </div>
                </Card>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <Card title="Total Debitur" className="mb-0">
                    <div className="text-center">
                        <span className="text-5xl font-bold">{formatCurrency(debiturTotal)}</span>
                    </div>
                </Card>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <Card title="Total Angsuran" className="mb-0">
                    <div className="text-center">
                        <span className="text-5xl font-bold">{formatCurrency(angsuranTotal)}</span>
                    </div>
                </Card>
            </div>

            <div className="col-12 xl:col-6">
                <Card title="Tabungan Trend">
                    <Chart type="line" data={tabunganTrend} options={tabunganTrendOptions} />
                </Card>
            </div>

            <div className="col-12 xl:col-6">
                <Card title="Debitur Distribution">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={debiturDistribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div className="col-12">
                <Card title="Recent Mutasi Tabungan">
                    <DataTable value={recentMutasi} paginator rows={5} className="p-datatable-customers">
                        <Column field="Tgl" header="Tanggal" />
                        <Column field="Rekening" header="Rekening" />
                        <Column field="KodeTransaksi" header="Kode Transaksi" />
                        <Column field="DK" header="D/K" />
                        <Column field="Keterangan" header="Keterangan" />
                        <Column field="Jumlah" header="Jumlah" body={(rowData) => formatCurrency(rowData.Jumlah)} />
                    </DataTable>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
