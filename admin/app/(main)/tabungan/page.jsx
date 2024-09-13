'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import TabunganApi from '@/services/TabunganApi';
import NasabahApi from '@/services/NasabahApi';
import { Toolbar } from 'primereact/toolbar';
import { useUser } from '@/context/userContext';

const TabunganCrud = () => {
    const { user } = useUser();
    const [tabungans, setTabungans] = useState(null);
    const [tabunganDialog, setTabunganDialog] = useState(false);
    const [deleteTabunganDialog, setDeleteTabunganDialog] = useState(false);
    const [deleteTabungansDialog, setDeleteTabungansDialog] = useState(false);
    const [tabungan, setTabungan] = useState(initEmptyTabungan());
    const [selectedTabungans, setSelectedTabungans] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [nasabahDialog, setNasabahDialog] = useState(false);
    const [nasabahs, setNasabahs] = useState([]);
    const [nasabahFilter, setNasabahFilter] = useState('');
    const toast = useRef(null);
    const dt = useRef(null);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: null
    });
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    function initEmptyTabungan() {
        return {
            ID: null,
            Rekening: '',
            RekeningLama: '',
            Tgl: new Date(),
            Kode: '',
            NamaNasabah: '',
            GolonganTabungan: '',
            StatusBlokir: '0',
            JumlahBlokir: 0,
            TglPenutupan: '',
            KeteranganBlokir: '',
            SaldoAkhir: 0,
            Pekerjaan: '',
            UserName: user.username
        };
    }

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await TabunganApi.getTabungans({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setTabungans(response.data.data || []);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Error loading tabungans:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data tabungan', life: 3000 });
        }
        setLoading(false);
    };

    const openNew = () => {
        setTabungan(initEmptyTabungan());
        setSubmitted(false);
        setTabunganDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTabunganDialog(false);
    };

    const hideDeleteTabunganDialog = () => {
        setDeleteTabunganDialog(false);
    };

    const hideDeleteTabungansDialog = () => {
        setDeleteTabungansDialog(false);
    };

    const saveTabungan = async () => {
        setSubmitted(true);

        if (tabungan.Rekening.trim()) {
            try {
                tabungan.Tgl = tabungan.Tgl ? tabungan.Tgl.toISOString().split('T')[0] : null;
                tabungan.TglPenutupan = tabungan.TglPenutupan ? tabungan.TglPenutupan.toISOString().split('T')[0] : null;

                if (tabungan.ID) {
                    await TabunganApi.updateTabungan(tabungan.ID, tabungan);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data tabungan berhasil diubah', life: 3000 });
                } else {
                    await TabunganApi.createTabungan(tabungan);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan tabungan baru', life: 3000 });
                }

                loadLazyData();
                setTabunganDialog(false);
                setTabungan(initEmptyTabungan());
            } catch (error) {
                console.error('Error saving tabungan:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data tabungan', life: 3000 });
            }
        }
    };

    const editTabungan = (tabungan) => {
        setTabungan({ ...tabungan });
        setTabunganDialog(true);
    };

    const confirmDeleteTabungan = (tabungan) => {
        setTabungan(tabungan);
        setDeleteTabunganDialog(true);
    };

    const deleteTabungan = async () => {
        try {
            await TabunganApi.deleteTabungan(tabungan.ID);
            loadLazyData();
            setDeleteTabunganDialog(false);
            setTabungan(initEmptyTabungan());
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data tabungan berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting tabungan:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data tabungan', life: 3000 });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteTabungansDialog(true);
    };

    const deleteSelectedTabungans = async () => {
        try {
            await TabunganApi.deleteMultipleTabungans(selectedTabungans.map(tabungan => tabungan.ID));
            loadLazyData();
            setDeleteTabungansDialog(false);
            setSelectedTabungans(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus tabungan terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple tabungans:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus tabungan terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _tabungan = { ...tabungan };
        _tabungan[`${name}`] = val;
        setTabungan(_tabungan);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _tabungan = { ...tabungan };
        _tabungan[`${name}`] = val;
        setTabungan(_tabungan);
    };

    const onDateChange = (e, name) => {
        let _tabungan = { ...tabungan };
        _tabungan[`${name}`] = e.value;
        setTabungan(_tabungan);
    };

    const openNasabahDialog = async () => {
        try {
            const response = await NasabahApi.getNasabahs();
            setNasabahs(response.data.data || []);
            setNasabahDialog(true);
        } catch (error) {
            console.error('Error loading nasabahs:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data nasabah', life: 3000 });
        }
    };

    const hideNasabahDialog = () => {
        setNasabahDialog(false);
        setNasabahFilter('');
    };

    const onNasabahSelect = (nasabah) => {
        setTabungan({ ...tabungan, Kode: nasabah.Kode, NamaNasabah: nasabah.Nama });
        hideNasabahDialog();
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editTabungan(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteTabungan(rowData)} />
            </React.Fragment>
        );
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Tambah" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Hapus" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedTabungans || !selectedTabungans.length} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manajemen Tabungan</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." />
            </span>
        </div>
    );

    const nasabahHeader = (
        <div className="flex flex-column">
            <h5 className="m-0">Data Nasabah</h5>
            <span className="block mt-2 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setNasabahFilter(e.target.value)}
                    placeholder="Cari..."
                />
            </span>
        </div>
    );

    const tabunganDialogFooter = (
        <React.Fragment>
            <Button label="Batal" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" onClick={saveTabungan} />
        </React.Fragment>
    );

    const deleteTabunganDialogFooter = (
        <React.Fragment>
            <Button label="Tidak" icon="pi pi-times" outlined onClick={hideDeleteTabunganDialog} />
            <Button label="Ya" icon="pi pi-check" severity="danger" onClick={deleteTabungan} />
        </React.Fragment>
    );

    const deleteTabungansDialogFooter = (
        <React.Fragment>
            <Button label="Tidak" icon="pi pi-times" outlined onClick={hideDeleteTabungansDialog} />
            <Button label="Ya" icon="pi pi-check" severity="danger" onClick={deleteSelectedTabungans} />
        </React.Fragment>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={tabungans}
                        selection={selectedTabungans}
                        onSelectionChange={(e) => setSelectedTabungans(e.value)}
                        dataKey="ID"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tabungans"
                        globalFilter={globalFilter}
                        emptyMessage="No tabungans found."
                        header={header}
                        responsiveLayout="scroll"
                        lazy
                        totalRecords={totalRecords}
                        loading={loading}
                        first={lazyParams.first}
                        onPage={(e) => setLazyParams({ ...lazyParams, ...e })}
                        onSort={(e) => setLazyParams({ ...lazyParams, ...e })}
                        onFilter={(e) => setLazyParams({ ...lazyParams, ...e })}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="Rekening" header="Rekening" sortable body={(rowData) => <span>{rowData.Rekening}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="NamaNasabah" header="Nama Nasabah" sortable body={(rowData) => <span>{rowData.NamaNasabah}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="SaldoAkhir" header="Saldo Akhir" sortable body={(rowData) => <span>{rowData.SaldoAkhir.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="StatusBlokir" header="Status Blokir" sortable body={(rowData) => <span>{rowData.StatusBlokir === '1' ? 'Diblokir' : 'Aktif'}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={tabunganDialog} style={{ width: '80%' }} header="Detail Tabungan" modal className="p-fluid" footer={tabunganDialogFooter} onHide={hideDialog}>
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label htmlFor="Rekening">Rekening</label>
                                    <InputText id="Rekening" value={tabungan.Rekening} onChange={(e) => onInputChange(e, 'Rekening')} required autoFocus className={classNames({ 'p-invalid': submitted && !tabungan.Rekening })} />
                                    {submitted && !tabungan.Rekening && <small className="p-invalid">Rekening is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="Kode">Kode Nasabah</label>
                                    <div className="p-inputgroup">
                                        <InputText id="Kode" value={tabungan.Kode} readOnly />
                                        <Button icon="pi pi-search" className="p-button-warning" onClick={openNasabahDialog} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="NamaNasabah">Nama Nasabah</label>
                                    <InputText id="NamaNasabah" value={tabungan.NamaNasabah} readOnly />
                                </div>
                                <div className="field">
                                    <label htmlFor="GolonganTabungan">Golongan Tabungan</label>
                                    <InputText id="GolonganTabungan" value={tabungan.GolonganTabungan} onChange={(e) => onInputChange(e, 'GolonganTabungan')} />
                                </div>
                                <div className="field">
                                    <label htmlFor="StatusBlokir">Status Blokir</label>
                                    <Dropdown
                                        id="StatusBlokir"
                                        value={tabungan.StatusBlokir}
                                        options={[
                                            { label: 'Aktif', value: '0' },
                                            { label: 'Diblokir', value: '1' }
                                        ]}
                                        onChange={(e) => onInputChange(e, 'StatusBlokir')}
                                        placeholder="Pilih Status Blokir"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="JumlahBlokir">Jumlah Blokir</label>
                                    <InputNumber id="JumlahBlokir" value={tabungan.JumlahBlokir} onValueChange={(e) => onInputNumberChange(e, 'JumlahBlokir')} mode="currency" currency="IDR" locale="id-ID" />
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="field">
                                    <label htmlFor="SaldoAkhir">Saldo Akhir</label>
                                    <InputNumber id="SaldoAkhir" value={tabungan.SaldoAkhir} onValueChange={(e) => onInputNumberChange(e, 'SaldoAkhir')} mode="currency" currency="IDR" locale="id-ID" />
                                </div>
                                <div className="field">
                                    <label htmlFor="Tgl">Tanggal</label>
                                    <Calendar id="Tgl" value={tabungan.Tgl} onChange={(e) => onDateChange(e, 'Tgl')} showIcon />
                                </div>
                                <div className="field">
                                    <label htmlFor="TglPenutupan">Tanggal Penutupan</label>
                                    <Calendar id="TglPenutupan" value={tabungan.TglPenutupan} onChange={(e) => onDateChange(e, 'TglPenutupan')} showIcon />
                                </div>
                                <div className="field">
                                    <label htmlFor="KeteranganBlokir">Keterangan Blokir</label>
                                    <InputText id="KeteranganBlokir" value={tabungan.KeteranganBlokir} onChange={(e) => onInputChange(e, 'KeteranganBlokir')} />
                                </div>
                                <div className="field">
                                    <label htmlFor="Pekerjaan">Pekerjaan</label>
                                    <InputText id="Pekerjaan" value={tabungan.Pekerjaan} onChange={(e) => onInputChange(e, 'Pekerjaan')} required />
                                </div>
                                <div className="field">
                                    <label htmlFor="UserName">User Name</label>
                                    <InputText id="UserName" value={tabungan.UserName} onChange={(e) => onInputChange(e, 'UserName')} />
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTabunganDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTabunganDialogFooter} onHide={hideDeleteTabunganDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tabungan && (
                                <span>
                                    Apakah Anda yakin ingin menghapus data tabungan <b>{tabungan.Rekening}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTabungansDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTabungansDialogFooter} onHide={hideDeleteTabungansDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tabungan && (
                                <span>
                                    Apakah Anda yakin ingin menghapus data tabungan terpilih?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={nasabahDialog} style={{ width: '100%', maxWidth: '1280px' }} header="Pilih Nasabah" modal onHide={hideNasabahDialog}>
                        <DataTable
                            value={nasabahs.filter((nasabah) => {
                                return nasabah.Kode.toLowerCase().includes(nasabahFilter.toLowerCase()) || nasabah.Nama.toLowerCase().includes(nasabahFilter.toLowerCase());
                            })}
                            dataKey="ID"
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} nasabahs"
                            emptyMessage="No nasabahs found."
                            header={nasabahHeader}
                        >
                            <Column field="Kode" header="Kode" sortable body={(rowData) => <span>{rowData.Kode}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="Nama" header="Nama" sortable body={(rowData) => <span>{rowData.Nama}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="Alamat" header="Alamat" sortable body={(rowData) => <span>{rowData.Alamat}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="Telepon" header="Telepon" sortable body={(rowData) => <span>{rowData.Telepon}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="Email" header="Email" sortable body={(rowData) => <span>{rowData.Email}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column
                                body={(rowData) => (
                                    <Button
                                        label="Pilih"
                                        icon="pi pi-check"
                                        onClick={() => onNasabahSelect(rowData)}
                                    />
                                )}
                                headerStyle={{ minWidth: '10rem' }}
                            ></Column>
                        </DataTable>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default TabunganCrud;
