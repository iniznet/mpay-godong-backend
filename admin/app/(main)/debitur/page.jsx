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
import DebiturApi from '@/services/DebiturApi';
import { Toolbar } from 'primereact/toolbar';
import TabunganApi from '@/services/TabunganApi';
import NasabahApi from '@/services/NasabahApi';

const DebiturCrud = () => {
    const [debiturs, setDebiturs] = useState(null);
    const [debiturDialog, setDebiturDialog] = useState(false);
    const [deleteDebiturDialog, setDeleteDebiturDialog] = useState(false);
    const [deleteDebitursDialog, setDeleteDebitursDialog] = useState(false);
    const [debitur, setDebitur] = useState(initEmptyDebitur());
    const [selectedDebiturs, setSelectedDebiturs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
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
    const [rekeningDialog, setRekeningDialog] = useState(false);
    const [rekenings, setRekenings] = useState([]);
    const [rekeningFilter, setRekeningFilter] = useState('');
    const [nasabahDialog, setNasabahDialog] = useState(false);
    const [nasabahs, setNasabahs] = useState([]);
    const [nasabahFilter, setNasabahFilter] = useState('');

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    function initEmptyDebitur() {
        return {
            ID: null,
            Kode: '',
            Faktur: '',
            Rekening: '',
            NamaNasabah: '',
            RekeningLama: '',
            Tgl: new Date(),
            StatusPencairan: '0',
            NoPengajuan: '',
            RekeningJaminan: '',
            Jaminan: '',
            KeteranganJaminan: '',
            Wilayah: '',
            SukuBunga: 0,
            Plafond: 0,
            PencairanPokok: 0,
            TotalBunga: 0,
            SaldoPokok: 0,
            SaldoBunga: 0,
            SaldoTitipan: 0,
            RekeningTabungan: '',
            DateTime: new Date(),
            UserName: ''
        };
    }

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await DebiturApi.getDebiturs({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setDebiturs(response.data.data || []);
            setTotalRecords(response.data.total);
        } catch (error) {
            console.error('Error loading debiturs:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data debitur', life: 3000 });
        }
        setLoading(false);
    };

    const openNew = async () => {
        setDebitur(initEmptyDebitur());

        const response = await DebiturApi.getNextFaktur();
        setDebitur({ ...debitur, Faktur: response.data.faktur });

        setSubmitted(false);
        setDebiturDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDebiturDialog(false);
    };

    const hideDeleteDebiturDialog = () => {
        setDeleteDebiturDialog(false);
    };

    const hideDeleteDebitursDialog = () => {
        setDeleteDebitursDialog(false);
    };

    const saveDebitur = async () => {
        setSubmitted(true);

        if (debitur.Rekening.trim()) {
                let debiturToSave = { ...debitur };

            if (debiturToSave.Tgl) {
                debiturToSave.Tgl = new Date(debiturToSave.Tgl).toISOString().split('T')[0];
            }

            if (debiturToSave.DateTime) {
                debiturToSave.DateTime = new Date(debiturToSave.DateTime).toISOString().slice(0, 19).replace('T', ' ');
            }

            try {
                if (debitur.ID) {
                    await DebiturApi.updateDebitur(debitur.ID, debiturToSave);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data debitur berhasil diubah', life: 3000 });
                } else {
                    await DebiturApi.createDebitur(debiturToSave);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan debitur baru', life: 3000 });
                }

                loadLazyData();
                setDebiturDialog(false);
                setDebitur(initEmptyDebitur());
            } catch (error) {
                console.error('Error saving debitur:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data debitur', life: 3000 });
            }
        }
    };

    const editDebitur = (debitur) => {
        setDebitur({ ...debitur });
        setDebiturDialog(true);
    };

    const confirmDeleteDebitur = (debitur) => {
        setDebitur(debitur);
        setDeleteDebiturDialog(true);
    };

    const deleteDebitur = async () => {
        try {
            await DebiturApi.deleteDebitur(debitur.ID);
            loadLazyData();
            setDeleteDebiturDialog(false);
            setDebitur(initEmptyDebitur());
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data debitur berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting debitur:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data debitur', life: 3000 });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteDebitursDialog(true);
    };

    const deleteSelectedDebiturs = async () => {
        try {
            await DebiturApi.deleteMultipleDebiturs(selectedDebiturs.map(debitur => debitur.ID));
            loadLazyData();
            setDeleteDebitursDialog(false);
            setSelectedDebiturs(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus debitur terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple debiturs:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus debitur terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _debitur = { ...debitur };
        _debitur[`${name}`] = val;
        setDebitur(_debitur);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _debitur = { ...debitur };
        _debitur[`${name}`] = val;
        setDebitur(_debitur);
    };

    const onDateChange = (e, name) => {
        let _debitur = { ...debitur };
        _debitur[`${name}`] = e.value;
        setDebitur(_debitur);
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
        setDebitur({ ...debitur, Kode: nasabah.Kode });
        hideNasabahDialog();
    };

    const onRekeningSelect = (rekening) => {
        setDebitur({ ...debitur, RekeningTabungan: rekening.Rekening });
        hideRekeningDialog();
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editDebitur(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteDebitur(rowData)} />
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
                <Button label="Hapus" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedDebiturs || !selectedDebiturs.length} />
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
            <h5 className="m-0">Manajemen Debitur</h5>
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

    const nasabahHeader = (
        <div className="flex flex-column">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setNasabahFilter(e.target.value)} placeholder="Cari nasabah..." />
            </span>
        </div>
    );

    const debiturDialogFooter = (
        <React.Fragment>
            <Button label="Batal" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" onClick={saveDebitur} />
        </React.Fragment>
    );

    const deleteDebiturDialogFooter = (
        <React.Fragment>
            <Button label="Tidak" icon="pi pi-times" outlined onClick={hideDeleteDebiturDialog} />
            <Button label="Ya" icon="pi pi-check" severity="danger" onClick={deleteDebitur} />
        </React.Fragment>
    );

    const deleteDebitursDialogFooter = (
        <React.Fragment>
            <Button label="Tidak" icon="pi pi-times" outlined onClick={hideDeleteDebitursDialog} />
            <Button label="Ya" icon="pi pi-check" severity="danger" onClick={deleteSelectedDebiturs} />
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
                        value={debiturs}
                        selection={selectedDebiturs}
                        onSelectionChange={(e) => setSelectedDebiturs(e.value)}
                        dataKey="ID"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} debiturs"
                        globalFilter={globalFilter}
                        emptyMessage="No debiturs found."
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
                        <Column field="Faktur" header="Faktur" sortable body={(rowData) => <span>{rowData.Faktur}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Plafond" header="Plafond" sortable body={(rowData) => <span>{rowData.Plafond.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="StatusPencairan" header="Status Pencairan" sortable body={(rowData) => <span>{rowData.StatusPencairan === '1' ? 'Sudah Cair' : 'Belum Cair'}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={debiturDialog} style={{ width: '80%' }} header="Detail Debitur" modal className="p-fluid" footer={debiturDialogFooter} onHide={hideDialog}>
                         <div className="grid">
                            <div className="col-6">
                                <div className="field">
                                    <label htmlFor="Kode">Nasabah</label>
                                    <div className="p-inputgroup">
                                        <InputText id="Kode" value={debitur.Kode} onChange={(e) => onInputChange(e, 'Kode')} maxLength={15} />
                                        <Button icon="pi pi-search" className="p-button-warning" onClick={openNasabahDialog} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="Rekening">Rekening</label>
                                    <InputText id="Rekening" value={debitur.Rekening} onChange={(e) => onInputChange(e, 'Rekening')} required autoFocus className={classNames({ 'p-invalid': submitted && !debitur.Rekening })} />
                                    {submitted && !debitur.Rekening && <small className="p-invalid">Rekening is required.</small>}
                                </div>
                                <div className="field">
                                    <label htmlFor="NamaNasabah">Nama Nasabah</label>
                                    <InputText id="NamaNasabah" value={debitur.NamaNasabah} onChange={(e) => onInputChange(e, 'NamaNasabah')} required />
                                </div>
                                <div className="field">
                                    <label htmlFor="Faktur">Faktur</label>
                                    <InputText id="Faktur" value={debitur.Faktur} readOnly/>
                                </div>
                                <div className="field">
                                    <label htmlFor="RekeningJaminan">Rekening Jaminan</label>
                                    <InputText id="RekeningJaminan" value={debitur.RekeningJaminan} onChange={(e) => onInputChange(e, 'RekeningJaminan')} required />
                                </div>
                                <div className="field">
                                    <label htmlFor="Jaminan">Jaminan</label>
                                    <InputText id="Jaminan" value={debitur.Jaminan} onChange={(e) => onInputChange(e, 'Jaminan')} required />
                                </div>
                                <div className="field">
                                    <label htmlFor="StatusPencairan">Status Pencairan</label>
                                    <Dropdown
                                        id="StatusPencairan"
                                        value={debitur.StatusPencairan}
                                        options={[
                                            { label: 'Belum Cair', value: '0' },
                                            { label: 'Sudah Cair', value: '1' }
                                        ]}
                                        onChange={(e) => onInputChange(e, 'StatusPencairan')}
                                        placeholder="Pilih Status Pencairan"
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="NoPengajuan">No Pengajuan</label>
                                    <InputText id="NoPengajuan" value={debitur.NoPengajuan} onChange={(e) => onInputChange(e, 'NoPengajuan')} />
                                </div>
                                <div className="field">
                                    <label htmlFor="KeteranganJaminan">Keterangan Jaminan</label>
                                    <InputText id="KeteranganJaminan" value={debitur.KeteranganJaminan} onChange={(e) => onInputChange(e, 'KeteranganJaminan')} />
                                </div>
                                <div className="field">
                                    <label htmlFor="Wilayah">Wilayah</label>
                                    <InputText id="Wilayah" value={debitur.Wilayah} onChange={(e) => onInputChange(e, 'Wilayah')} />
                                </div>
                                <div className="field">
                                    <label htmlFor="SukuBunga">Suku Bunga</label>
                                    <InputNumber id="SukuBunga" value={debitur.SukuBunga} onValueChange={(e) => onInputNumberChange(e, 'SukuBunga')} mode="decimal" minFractionDigits={5} maxFractionDigits={5} />
                                </div>
                            </div>

                            <div className="col-6">
                                <div className="field">
                                    <label htmlFor="Plafond">Plafond</label>
                                    <InputNumber id="Plafond" value={debitur.Plafond} onValueChange={(e) => onInputNumberChange(e, 'Plafond')} mode="currency" currency="IDR" locale="id-ID" />
                                </div>
                                <div className="field">
                                    <label htmlFor="PencairanPokok">Pencairan Pokok</label>
                                    <InputNumber id="PencairanPokok" value={debitur.PencairanPokok} onValueChange={(e) => onInputNumberChange(e, 'PencairanPokok')} mode="currency" currency="IDR" locale="id-ID" />
                                </div>
                                <div className="field">
                                    <label htmlFor="TotalBunga">Total Bunga</label>
                                    <InputNumber id="TotalBunga" value={debitur.TotalBunga} onValueChange={(e) => onInputNumberChange(e, 'TotalBunga')} mode="currency" currency="IDR" locale="id-ID" />
                                </div>
                                <div className="field">
                                    <label htmlFor="SaldoPokok">Saldo Pokok</label>
                                    <InputNumber id="SaldoPokok" value={debitur.SaldoPokok} onValueChange={(e) => onInputNumberChange(e, 'SaldoPokok')} mode="currency" currency="IDR" locale="id-ID" />
                                </div>
                                <div className="field">
                                    <label htmlFor="SaldoBunga">Saldo Bunga</label>
                                    <InputNumber id="SaldoBunga" value={debitur.SaldoBunga} onValueChange={(e) => onInputNumberChange(e, 'SaldoBunga')} mode="currency" currency="IDR" locale="id-ID" />
                                </div>
                                <div className="field">
                                    <label htmlFor="SaldoTitipan">Saldo Titipan</label>
                                    <InputNumber id="SaldoTitipan" value={debitur.SaldoTitipan} onValueChange={(e) => onInputNumberChange(e, 'SaldoTitipan')} mode="currency" currency="IDR" locale="id-ID" />
                                </div>
                                <div className="field">
                                    <label htmlFor="RekeningTabungan">Rekening Tabungan</label>
                                    <div className="p-inputgroup">
                                        <InputText id="RekeningTabungan" value={debitur.RekeningTabungan} onChange={(e) => onInputChange(e, 'RekeningTabungan')} maxLength={15} />
                                        <Button icon="pi pi-search" className="p-button-warning" onClick={openRekeningDialog} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="Tgl">Tanggal</label>
                                    <Calendar id="Tgl" value={debitur.Tgl} onChange={(e) => onDateChange(e, 'Tgl')} showIcon />
                                </div>
                                <div className="field">
                                    <label htmlFor="DateTime">Date Time</label>
                                    <Calendar id="DateTime" value={debitur.DateTime} onChange={(e) => onDateChange(e, 'DateTime')} showIcon showTime />
                                </div>
                                <div className="field">
                                    <label htmlFor="UserName">User Name</label>
                                    <InputText id="UserName" value={debitur.UserName} onChange={(e) => onInputChange(e, 'UserName')} />
                                </div>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDebiturDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDebiturDialogFooter} onHide={hideDeleteDebiturDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {debitur && (
                                <span>
                                    Apakah Anda yakin ingin menghapus data debitur <b>{debitur.Rekening}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDebitursDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDebitursDialogFooter} onHide={hideDeleteDebitursDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {debitur && (
                                <span>
                                    Apakah Anda yakin ingin menghapus data debitur terpilih?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={nasabahDialog} style={{ width: '100%', maxWidth: '1280px' }} header="Pilih Nasabah" modal className="p-fluid" onHide={hideNasabahDialog}>
                        <DataTable
                            value={nasabahs.filter(nasabah => {
                                return nasabah.Kode.toLowerCase().includes(nasabahFilter.toLowerCase()) || nasabah.Nama.toLowerCase().includes(nasabahFilter.toLowerCase());
                            })}
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 25]}
                            scrollable
                            scrollHeight="200px"
                            header={nasabahFilter}
                            emptyMessage="No nasabahs found."
                        >
                            <Column field="Kode" header="Kode" sortable body={(rowData) => <span>{rowData.Kode}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="Nama" header="Nama" sortable body={(rowData) => <span>{rowData.Nama}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="KTP" header="KTP" sortable body={(rowData) => <span>{rowData.KTP}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="Telepon" header="Telepon" sortable body={(rowData) => <span>{rowData.Telepon}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="Alamat" header="Alamat" sortable body={(rowData) => <span>{rowData.Alamat}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
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
};

export default DebiturCrud;
