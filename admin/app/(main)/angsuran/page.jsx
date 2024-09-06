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
import AngsuranApi from '@/services/AngsuranApi';
import DebiturApi from '@/services/DebiturApi';

const AngsuranCrud = () => {
    const [angsurans, setAngsurans] = useState(null);
    const [angsuranDialog, setAngsuranDialog] = useState(false);
    const [deleteAngsuranDialog, setDeleteAngsuranDialog] = useState(false);
    const [deleteAngsuransDialog, setDeleteAngsuransDialog] = useState(false);
    const [angsuran, setAngsuran] = useState(initEmptyAngsuran());
    const [selectedAngsurans, setSelectedAngsurans] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [rekeningDialog, setRekeningDialog] = useState(false);
    const [debiturs, setDebiturs] = useState([]);
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

    function initEmptyAngsuran() {
        return {
            ID: null,
            CabangEntry: '',
            Status: '',
            Faktur: '',
            Tgl: new Date(),
            Rekening: '',
            Keterangan: '',
            DPokok: 0,
            KPokok: 0,
            DBunga: 0,
            KBunga: 0,
            Denda: 0,
            Administrasi: 0,
            Kas: 'K',
            DateTime: null,
            UserName: ''
        };
    }

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await AngsuranApi.getAngsurans({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setAngsurans(response.data.data);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Error loading angsurans:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data angsuran', life: 3000 });
        }
        setLoading(false);
    };

    const openNew = async () => {
        setAngsuran(initEmptyAngsuran());

        const response = await AngsuranApi.getNextFaktur();
        setAngsuran({ ...angsuran, Faktur: response.data.faktur });

        setSubmitted(false);
        setAngsuranDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAngsuranDialog(false);
    };

    const hideDeleteAngsuranDialog = () => {
        setDeleteAngsuranDialog(false);
    };

    const hideDeleteAngsuransDialog = () => {
        setDeleteAngsuransDialog(false);
    };

    const saveAngsuran = async () => {
        setSubmitted(true);

        if (angsuran.Rekening.trim()) {
            try {
                let angsuranToSave = { ...angsuran };

                if (angsuranToSave.Tgl) {
                    angsuranToSave.Tgl = new Date(angsuranToSave.Tgl).toISOString().split('T')[0];
                }

                if (angsuranToSave.DateTime) {
                    angsuranToSave.DateTime = new Date(angsuranToSave.DateTime).toISOString().slice(0, 19).replace('T', ' ');
                }

                let response;
                if (angsuranToSave.ID) {
                    response = await AngsuranApi.updateAngsuran(angsuranToSave.ID, angsuranToSave);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data angsuran berhasil diubah', life: 3000 });
                } else {
                    response = await AngsuranApi.createAngsuran(angsuranToSave);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan angsuran baru', life: 3000 });
                }

                loadLazyData();
                setAngsuranDialog(false);
                setAngsuran(initEmptyAngsuran());
            } catch (error) {
                console.error('Error saving angsuran:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data angsuran', life: 3000 });
            }
        }
    };

    const editAngsuran = (angsuran) => {
        setAngsuran({ ...angsuran });
        setAngsuranDialog(true);
    };

    const confirmDeleteAngsuran = (angsuran) => {
        setAngsuran(angsuran);
        setDeleteAngsuranDialog(true);
    };

    const deleteAngsuran = async () => {
        try {
            await AngsuranApi.deleteAngsuran(angsuran.ID);
            loadLazyData();
            setDeleteAngsuranDialog(false);
            setAngsuran(initEmptyAngsuran());
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data angsuran berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting angsuran:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data angsuran', life: 3000 });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteAngsuransDialog(true);
    };

    const deleteSelectedAngsurans = async () => {
        try {
            await AngsuranApi.deleteMultipleAngsurans(selectedAngsurans.map(a => a.ID));
            loadLazyData();
            setDeleteAngsuransDialog(false);
            setSelectedAngsurans(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus angsuran terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple angsurans:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus angsuran terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _angsuran = { ...angsuran };
        _angsuran[`${name}`] = val;
        setAngsuran(_angsuran);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _angsuran = { ...angsuran };
        _angsuran[`${name}`] = val;
        setAngsuran(_angsuran);
    };

    const onDateChange = (e, name) => {
        let _angsuran = { ...angsuran };
        _angsuran[`${name}`] = e.value;
        setAngsuran(_angsuran);
    };

    const openRekeningDialog = async () => {
        try {
            const response = await DebiturApi.getDebiturs();
            setDebiturs(response.data.data || []);
            setRekeningDialog(true);
        } catch (error) {
            console.error('Error loading debiturs:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data debitur', life: 3000 });
        }
    };

    const hideRekeningDialog = () => {
        setRekeningDialog(false);
        setRekeningFilter('');
    };

    const onRekeningSelect = (debitur) => {
        setAngsuran({ ...angsuran, Rekening: debitur.Rekening });
        hideRekeningDialog();
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editAngsuran(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteAngsuran(rowData)} />
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
                <Button label="Hapus" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedAngsurans || !selectedAngsurans.length} />
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
            <h5 className="m-0">Manajemen Angsuran</h5>
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

    const angsuranDialogFooter = (
        <React.Fragment>
            <Button label="Batal" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" onClick={saveAngsuran} />
        </React.Fragment>
    );

    const deleteAngsuranDialogFooter = (
        <React.Fragment>
            <Button label="Tidak" icon="pi pi-times" outlined onClick={hideDeleteAngsuranDialog} />
            <Button label="Ya" icon="pi pi-check" severity="danger" onClick={deleteAngsuran} />
        </React.Fragment>
    );

    const deleteAngsuransDialogFooter = (
        <React.Fragment>
            <Button label="Tidak" icon="pi pi-times" outlined onClick={hideDeleteAngsuransDialog} />
            <Button label="Ya" icon="pi pi-check" severity="danger" onClick={deleteSelectedAngsurans} />
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
                        value={angsurans}
                        selection={selectedAngsurans}
                        onSelectionChange={(e) => setSelectedAngsurans(e.value)}
                        dataKey="ID"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} angsurans"
                        globalFilter={globalFilter}
                        emptyMessage="No angsurans found."
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
                        <Column field="DPokok" header="Debet Pokok" sortable body={(rowData) => <span>{rowData.DPokok.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="KPokok" header="Kredit Pokok" sortable body={(rowData) => <span>{rowData.KPokok.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="DBunga" header="Debet Bunga" sortable body={(rowData) => <span>{rowData.DBunga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="KBunga" header="Kredit Bunga" sortable body={(rowData) => <span>{rowData.KBunga.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="Denda" header="Denda" sortable body={(rowData) => <span>{rowData.Denda.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={angsuranDialog} style={{ width: '450px' }} header="Detail Angsuran" modal className="p-fluid" footer={angsuranDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="CabangEntry">Cabang Entry</label>
                            <InputText id="CabangEntry" value={angsuran.CabangEntry} onChange={(e) => onInputChange(e, 'CabangEntry')} maxLength={3} />
                        </div>
                        <div className="field">
                            <label htmlFor="Status">Status</label>
                            <InputText id="Status" value={angsuran.Status} onChange={(e) => onInputChange(e, 'Status')} maxLength={1} />
                        </div>
                        <div className="field">
                            <label htmlFor="Faktur">Faktur</label>
                            <InputText id="Faktur" value={angsuran.Faktur} onChange={(e) => onInputChange(e, 'Faktur')} required autoFocus className={classNames({ 'p-invalid': submitted && !angsuran.Faktur })} maxLength={20} />
                            {submitted && !angsuran.Faktur && <small className="p-invalid">Faktur is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Tgl">Tanggal</label>
                            <Calendar id="Tgl" value={angsuran.Tgl ? new Date(angsuran.Tgl) : null} onChange={(e) => onDateChange(e, 'Tgl')} showIcon dateFormat="dd/mm/yy" />
                        </div>
                        <div className="field">
                            <label htmlFor="Rekening">Rekening</label>
                            <div className="p-inputgroup">
                                <InputText id="Rekening" value={angsuran.Rekening} onChange={(e) => onInputChange(e, 'Rekening')} maxLength={15} />
                                <Button icon="pi pi-search" className="p-button-warning" onClick={openRekeningDialog} />
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="Keterangan">Keterangan</label>
                            <InputText id="Keterangan" value={angsuran.Keterangan} onChange={(e) => onInputChange(e, 'Keterangan')} maxLength={255} />
                        </div>
                        <div className="field">
                            <label htmlFor="DPokok">Debet Pokok</label>
                            <InputNumber id="DPokok" value={angsuran.DPokok} onValueChange={(e) => onInputNumberChange(e, 'DPokok')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                        <div className="field">
                            <label htmlFor="KPokok">Kredit Pokok</label>
                            <InputNumber id="KPokok" value={angsuran.KPokok} onValueChange={(e) => onInputNumberChange(e, 'KPokok')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                        <div className="field">
                            <label htmlFor="DBunga">Debet Bunga</label>
                            <InputNumber id="DBunga" value={angsuran.DBunga} onValueChange={(e) => onInputNumberChange(e, 'DBunga')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                        <div className="field">
                            <label htmlFor="KBunga">Kredit Bunga</label>
                            <InputNumber id="KBunga" value={angsuran.KBunga} onValueChange={(e) => onInputNumberChange(e, 'KBunga')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                        <div className="field">
                            <label htmlFor="Denda">Denda</label>
                            <InputNumber id="Denda" value={angsuran.Denda} onValueChange={(e) => onInputNumberChange(e, 'Denda')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                        <div className="field">
                            <label htmlFor="Administrasi">Administrasi</label>
                            <InputNumber id="Administrasi" value={angsuran.Administrasi} onValueChange={(e) => onInputNumberChange(e, 'Administrasi')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                        <div className="field">
                            <label htmlFor="Kas">Kas</label>
                            <Dropdown
                                id="Kas"
                                value={angsuran.Kas}
                                options={[
                                    { label: 'Kredit', value: 'K' },
                                    { label: 'Debet', value: 'D' }
                                ]}
                                onChange={(e) => onInputChange(e, 'Kas')}
                                placeholder="Pilih Kas"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="DateTime">Date Time</label>
                            <Calendar id="DateTime" value={angsuran.DateTime ? new Date(angsuran.DateTime) : null} onChange={(e) => onDateChange(e, 'DateTime')} showIcon showTime hourFormat="24" />
                        </div>
                        <div className="field">
                            <label htmlFor="UserName">User Name</label>
                            <InputText id="UserName" value={angsuran.UserName} onChange={(e) => onInputChange(e, 'UserName')} maxLength={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAngsuranDialog} style={{ width: '450px' }} header="Konfirmasi Hapus" modal footer={deleteAngsuranDialogFooter} onHide={hideDeleteAngsuranDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {angsuran && <span>Apakah Anda yakin ingin menghapus angsuran ini?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAngsuransDialog} style={{ width: '450px' }} header="Konfirmasi Hapus" modal footer={deleteAngsuransDialogFooter} onHide={hideDeleteAngsuransDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedAngsurans && <span>Apakah Anda yakin ingin menghapus angsuran terpilih?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={rekeningDialog} style={{ width: '450px' }} header="Pilih Rekening" modal className="p-fluid" onHide={hideRekeningDialog}>
                        <DataTable
                            value={debiturs}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25]}
                            scrollable
                            scrollHeight="200px"
                            globalFilter={rekeningFilter}
                            header={rekeningHeader}
                            emptyMessage="No debiturs found."
                        >
                            <Column field="Rekening" header="Rekening" body={(rowData) => <Button label={rowData.Rekening} className="p-button-link" onClick={() => onRekeningSelect(rowData)} />} />
                        </DataTable>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default AngsuranCrud;
