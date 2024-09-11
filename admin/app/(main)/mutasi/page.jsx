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
import { Toolbar } from 'primereact/toolbar';
import MutasiTabunganApi from '@/services/MutasiTabunganApi';
import TabunganApi from '@/services/TabunganApi';

const MutasiTabunganCrud = () => {
    const [mutasiTabungans, setMutasiTabungans] = useState(null);
    const [mutasiTabunganDialog, setMutasiTabunganDialog] = useState(false);
    const [deleteMutasiTabunganDialog, setDeleteMutasiTabunganDialog] = useState(false);
    const [deleteMutasiTabungansDialog, setDeleteMutasiTabungansDialog] = useState(false);
    const [mutasiTabungan, setMutasiTabungan] = useState(initEmptyMutasiTabungan());
    const [selectedMutasiTabungans, setSelectedMutasiTabungans] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [rekeningDialog, setRekeningDialog] = useState(false);
    const [rekenings, setRekenings] = useState([]);
    const [rekeningFilter, setRekeningFilter] = useState('');
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

    function initEmptyMutasiTabungan() {
        const now = new Date();
        return {
            ID: null,
            CabangEntry: '',
            Faktur: '',
            Tgl: now,
            Rekening: '',
            KodeTransaksi: '',
            DK: '',
            Keterangan: '',
            Jumlah: 0,
            Debet: 0,
            Kredit: 0,
            UserName: '',
            DateTime: now,
            UserAcc: '',
            Denda: 0
        };
    }

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await MutasiTabunganApi.getMutasiTabungans({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setMutasiTabungans(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Error loading mutasi tabungans:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data mutasi tabungan', life: 3000 });
        }
        setLoading(false);
    };

    const openNew = async () => {
        setMutasiTabungan(initEmptyMutasiTabungan());

        const response = await MutasiTabunganApi.getNextFaktur();
        setMutasiTabungan(prev => ({ ...mutasiTabungan, Faktur: response.data.faktur }));

        setSubmitted(false);
        setMutasiTabunganDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setMutasiTabunganDialog(false);
    };

    const hideDeleteMutasiTabunganDialog = () => {
        setDeleteMutasiTabunganDialog(false);
    };

    const hideDeleteMutasiTabungansDialog = () => {
        setDeleteMutasiTabungansDialog(false);
    };

    const saveMutasiTabungan = async () => {
        setSubmitted(true);

        if (mutasiTabungan.Rekening.trim()) {
            try {
                let mutasiTabunganToSave = { ...mutasiTabungan };

                if (mutasiTabunganToSave.Tgl) {
                    mutasiTabunganToSave.Tgl = new Date(mutasiTabunganToSave.Tgl).toISOString().split('T')[0];
                }

                if (mutasiTabunganToSave.DateTime) {
                    mutasiTabunganToSave.DateTime = new Date(mutasiTabunganToSave.DateTime).toISOString().slice(0, 19).replace('T', ' ');
                }

                let response;
                if (mutasiTabunganToSave.ID) {
                    response = await MutasiTabunganApi.updateMutasiTabungan(mutasiTabunganToSave.ID, mutasiTabunganToSave);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data mutasi tabungan berhasil diubah', life: 3000 });
                } else {
                    response = await MutasiTabunganApi.createMutasiTabungan(mutasiTabunganToSave);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan mutasi tabungan baru', life: 3000 });
                }

                loadLazyData();
                setMutasiTabunganDialog(false);
                setMutasiTabungan(initEmptyMutasiTabungan());
            } catch (error) {
                console.error('Error saving mutasi tabungan:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data mutasi tabungan', life: 3000 });
            }
        }
    };

    const editMutasiTabungan = (mutasiTabungan) => {
        setMutasiTabungan({ ...mutasiTabungan });
        setMutasiTabunganDialog(true);
    };

    const confirmDeleteMutasiTabungan = (mutasiTabungan) => {
        setMutasiTabungan(mutasiTabungan);
        setDeleteMutasiTabunganDialog(true);
    };

    const deleteMutasiTabungan = async () => {
        try {
            await MutasiTabunganApi.deleteMutasiTabungan(mutasiTabungan.ID);
            loadLazyData();
            setDeleteMutasiTabunganDialog(false);
            setMutasiTabungan(initEmptyMutasiTabungan());
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data mutasi tabungan berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting mutasi tabungan:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data mutasi tabungan', life: 3000 });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteMutasiTabungansDialog(true);
    };

    const deleteSelectedMutasiTabungans = async () => {
        try {
            await MutasiTabunganApi.deleteMultipleMutasiTabungans(selectedMutasiTabungans.map(mt => mt.ID));
            loadLazyData();
            setDeleteMutasiTabungansDialog(false);
            setSelectedMutasiTabungans(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus mutasi tabungan terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple mutasi tabungans:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus mutasi tabungan terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _mutasiTabungan = { ...mutasiTabungan };
        _mutasiTabungan[`${name}`] = val;
        setMutasiTabungan(_mutasiTabungan);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _mutasiTabungan = { ...mutasiTabungan };
        _mutasiTabungan[`${name}`] = val;
        setMutasiTabungan(_mutasiTabungan);
    };

    const onDateChange = (e, name) => {
        let _mutasiTabungan = { ...mutasiTabungan };
        _mutasiTabungan[`${name}`] = e.value;
        setMutasiTabungan(_mutasiTabungan);
    };

    const openRekeningDialog = async () => {
        try {
            const response = await TabunganApi.getTabungans();
            setRekenings(response.data.data || []);
            setRekeningDialog(true);
        } catch (error) {
            console.error('Error loading rekenings:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data rekening', life: 3000 });
        }
    };

    const hideRekeningDialog = () => {
        setRekeningDialog(false);
        setRekeningFilter('');
    };

    const onRekeningSelect = (rekening) => {
        setMutasiTabungan({ ...mutasiTabungan, Rekening: rekening.Rekening });
        hideRekeningDialog();
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editMutasiTabungan(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteMutasiTabungan(rowData)} />
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
                <Button label="Hapus" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedMutasiTabungans || !selectedMutasiTabungans.length} />
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
            <h5 className="m-0">Manajemen Mutasi Tabungan</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." />
            </span>
        </div>
    );

    const rekeningHeader = (
        <div className="flex flex-column">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setRekeningFilter(e.target.value)} placeholder="Cari rekening..." />
            </span>
        </div>
    );

    const mutasiTabunganDialogFooter = (
        <React.Fragment>
            <Button label="Batal" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" onClick={saveMutasiTabungan} />
        </React.Fragment>
    );

    const deleteMutasiTabunganDialogFooter = (
        <React.Fragment>
            <Button label="Tidak" icon="pi pi-times" outlined onClick={hideDeleteMutasiTabunganDialog} />
            <Button label="Ya" icon="pi pi-check" severity="danger" onClick={deleteMutasiTabungan} />
        </React.Fragment>
    );

    const deleteMutasiTabungansDialogFooter = (
        <React.Fragment>
            <Button label="Tidak" icon="pi pi-times" outlined onClick={hideDeleteMutasiTabungansDialog} />
            <Button label="Ya" icon="pi pi-check" severity="danger" onClick={deleteSelectedMutasiTabungans} />
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
                        value={mutasiTabungans}
                        selection={selectedMutasiTabungans}
                        onSelectionChange={(e) => setSelectedMutasiTabungans(e.value)}
                        dataKey="ID"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} mutasi tabungans"
                        globalFilter={globalFilter}
                        emptyMessage="No mutasi tabungans found."
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
                        <Column field="Faktur" header="Faktur" sortable body={(rowData) => <span>{rowData.Faktur}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Tgl" header="Tanggal" sortable body={(rowData) => <span>{new Date(rowData.Tgl).toLocaleDateString()}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="Rekening" header="Rekening" sortable body={(rowData) => <span>{rowData.Rekening}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="KodeTransaksi" header="Kode Transaksi" sortable body={(rowData) => <span>{rowData.KodeTransaksi}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="DK" header="D/K" sortable body={(rowData) => <span>{rowData.DK === 'D' ? 'Debet' : 'Kredit'}</span>} headerStyle={{ minWidth: '5rem' }}></Column>
                        <Column field="Jumlah" header="Jumlah" sortable body={(rowData) => <span>{rowData.Jumlah.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={mutasiTabunganDialog} style={{ width: '80%' }} header="Detail Mutasi Tabungan" modal className="p-fluid" footer={mutasiTabunganDialogFooter} onHide={hideDialog}>
                        <div className="grid">
                            <div className="col-6">
                                <div className="field">
                                    <label htmlFor="CabangEntry">Cabang Entry</label>
                                    <InputText id="CabangEntry" value={mutasiTabungan.CabangEntry} onChange={(e) => onInputChange(e, 'CabangEntry')} maxLength={3} />
                                </div>
                                <div className="field">
                                    <label htmlFor="Faktur">Faktur</label>
                                    <InputText id="Faktur" value={mutasiTabungan.Faktur} onChange={(e) => onInputChange(e, 'Faktur')} required autoFocus className={classNames({ 'p-invalid': submitted && !mutasiTabungan.Faktur })} maxLength={20} />
                                    {submitted && !mutasiTabungan.Faktur && <small className="p-invalid">Faktur is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="Tgl">Tanggal</label>
                                    <Calendar id="Tgl" value={mutasiTabungan.Tgl} onChange={(e) => onDateChange(e, 'Tgl')} showIcon dateFormat="dd/mm/yy" />
                                </div>
                                <div className="field">
                                    <label htmlFor="Rekening">Rekening</label>
                                    <div className="p-inputgroup">
                                        <InputText id="Rekening" value={mutasiTabungan.Rekening} onChange={(e) => onInputChange(e, 'Rekening')} maxLength={15} />
                                        <Button icon="pi pi-search" className="p-button-warning" onClick={openRekeningDialog} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="KodeTransaksi">Kode Transaksi</label>
                                    <InputText id="KodeTransaksi" value={mutasiTabungan.KodeTransaksi} onChange={(e) => onInputChange(e, 'KodeTransaksi')} maxLength={3} />
                                </div>
                                <div className="field">
                                    <label htmlFor="DK">Setoran/Penarikan</label>
                                    <Dropdown
                                        id="DK"
                                        value={mutasiTabungan.DK}
                                        options={[
                                            { label: 'Penarikan', value: 'D' },
                                            { label: 'Setoran', value: 'K' }
                                        ]}
                                        onChange={(e) => onInputChange(e, 'DK')}
                                        placeholder="Pilih Setoran/Penarikan"
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                            <div className="field">
                                    <label htmlFor="Keterangan">Keterangan</label>
                                    <InputText id="Keterangan" value={mutasiTabungan.Keterangan} onChange={(e) => onInputChange(e, 'Keterangan')} maxLength={255} />
                                </div>
                                <div className="field">
                                    <label htmlFor="Jumlah">Jumlah</label>
                                    <InputNumber id="Jumlah" value={mutasiTabungan.Jumlah} onValueChange={(e) => onInputNumberChange(e, 'Jumlah')} mode="currency" currency="IDR" locale="id-ID" minFractionDigits={2} maxFractionDigits={2} />
                                </div>
                                <div className="field">
                                    <label htmlFor="UserName">User Name</label>
                                    <InputText id="UserName" value={mutasiTabungan.UserName} onChange={(e) => onInputChange(e, 'UserName')} maxLength={20} />
                                </div>
                                <div className="field">
                                    <label htmlFor="DateTime">Date Time</label>
                                    <Calendar id="DateTime" value={mutasiTabungan.DateTime} onChange={(e) => onDateChange(e, 'DateTime')} showIcon showTime hourFormat="24" />
                                </div>
                                <div className="field">
                                    <label htmlFor="UserAcc">User Acc</label>
                                    <InputText id="UserAcc" value={mutasiTabungan.UserAcc} onChange={(e) => onInputChange(e, 'UserAcc')} maxLength={20} />
                                </div>
                                <div className="field">
                                    <label htmlFor="Denda">Denda</label>
                                    <InputNumber id="Denda" value={mutasiTabungan.Denda} onValueChange={(e) => onInputNumberChange(e, 'Denda')} mode="currency" currency="IDR" locale="id-ID" minFractionDigits={2} maxFractionDigits={2} />
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMutasiTabunganDialog} style={{ width: '450px' }} header="Konfirmasi Hapus" modal footer={deleteMutasiTabunganDialogFooter} onHide={hideDeleteMutasiTabunganDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {mutasiTabungan && <span>Apakah Anda yakin ingin menghapus mutasi tabungan ini?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMutasiTabungansDialog} style={{ width: '450px' }} header="Konfirmasi Hapus" modal footer={deleteMutasiTabungansDialogFooter} onHide={hideDeleteMutasiTabungansDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedMutasiTabungans && <span>Apakah Anda yakin ingin menghapus mutasi tabungan terpilih?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={rekeningDialog} style={{ width: '100%', maxWidth: '1280px' }} header="Pilih Rekening" modal className="p-fluid" onHide={hideRekeningDialog}>
                        <DataTable
                            value={rekenings.filter(rekening => {
                                return rekening.Rekening.toLowerCase().includes(rekeningFilter.toLowerCase()) || rekening.NamaNasabah.toLowerCase().includes(rekeningFilter.toLowerCase());
                            })}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25]}
                            scrollable
                            scrollHeight="200px"
                            header={rekeningHeader}
                            emptyMessage="No rekenings found."
                        >
                            <Column field="Rekening" header="Rekening" sortable body={(rowData) => <span>{rowData.Rekening}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="NamaNasabah" header="Nama" sortable body={(rowData) => <span>{rowData.NamaNasabah}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="SaldoAkhir" header="Saldo" sortable body={(rowData) => <span>{rowData.SaldoAkhir.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column
                                body={(rowData) => (
                                    <Button
                                        label="Pilih"
                                        icon="pi pi-check"
                                        onClick={() => onRekeningSelect(rowData)}
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
}

export default MutasiTabunganCrud;
