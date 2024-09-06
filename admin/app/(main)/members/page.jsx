'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import NasabahApi from '@/services/NasabahApi';

const NasabahCrud = () => {
    let emptyNasabah = {
        ID: null,
        CabangEntry: '',
        Nama: '',
        Kode: '',
        Tgl: new Date(),
        KodeLama: '',
        TglLahir: null,
        TempatLahir: '',
        StatusPerkawinan: '',
        KTP: '',
        Agama: '',
        Alamat: '',
        Telepon: '',
        Email: '',
    };

    const [nasabahs, setNasabahs] = useState(null);
    const [nasabahDialog, setNasabahDialog] = useState(false);
    const [deleteNasabahDialog, setDeleteNasabahDialog] = useState(false);
    const [deleteNasabahsDialog, setDeleteNasabahsDialog] = useState(false);
    const [nasabah, setNasabah] = useState(emptyNasabah);
    const [selectedNasabahs, setSelectedNasabahs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
        sortField: null,
        sortOrder: null,
        filters: null
    });
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    const statusPerkawinanOptions = [
        { label: 'Belum Kawin', value: 'B' },
        { label: 'Kawin', value: 'K' },
        { label: 'Cerai Hidup', value: 'H' },
        { label: 'Cerai Mati', value: 'M' }
    ];

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await NasabahApi.getNasabahs({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setNasabahs(response.data.data);
            setTotalRecords(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error loading nasabahs:', error);
            setLoading(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data', life: 3000 });
        }
    };

    const openNew = () => {
        setNasabah(emptyNasabah);
        setSubmitted(false);
        setNasabahDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setNasabahDialog(false);
    };

    const hideDeleteNasabahDialog = () => {
        setDeleteNasabahDialog(false);
    };

    const hideDeleteNasabahsDialog = () => {
        setDeleteNasabahsDialog(false);
    };

    const saveNasabah = async () => {
        setSubmitted(true);

        if (nasabah.Nama.trim() && nasabah.Kode.trim()) {
            try {
                nasabah.Tgl = nasabah.Tgl ? nasabah.Tgl.toISOString().split('T')[0] : null;

                if (nasabah.ID) {
                    await NasabahApi.updateNasabah(nasabah.ID, nasabah);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data nasabah berhasil diubah', life: 3000 });
                } else {
                    await NasabahApi.createNasabah(nasabah);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan nasabah baru', life: 3000 });
                }

                loadLazyData();
                setNasabahDialog(false);
                setNasabah(emptyNasabah);
            } catch (error) {
                console.error('Error saving nasabah:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data nasabah', life: 3000 });
            }
        }
    };

    const editNasabah = (nasabah) => {
        setNasabah({ ...nasabah });
        setNasabahDialog(true);
    };

    const confirmDeleteNasabah = (nasabah) => {
        setNasabah(nasabah);
        setDeleteNasabahDialog(true);
    };

    const deleteNasabah = async () => {
        try {
            await NasabahApi.deleteNasabah(nasabah.ID);
            loadLazyData();
            setDeleteNasabahDialog(false);
            setNasabah(emptyNasabah);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data nasabah berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting nasabah:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data nasabah', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteNasabahsDialog(true);
    };

    const deleteSelectedNasabahs = async () => {
        try {
            await NasabahApi.deleteMultipleNasabahs(selectedNasabahs.map(nasabah => nasabah.ID));
            loadLazyData();
            setDeleteNasabahsDialog(false);
            setSelectedNasabahs(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus nasabah terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple nasabahs:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus nasabah terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _nasabah = { ...nasabah };
        _nasabah[`${name}`] = val;
        setNasabah(_nasabah);
    };

    const onDateChange = (e, name) => {
        let _nasabah = { ...nasabah };
        _nasabah[`${name}`] = e.value;
        setNasabah(_nasabah);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedNasabahs || !selectedNasabahs.length} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editNasabah(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteNasabah(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manajemen Nasabah</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." />
            </span>
        </div>
    );

    const nasabahDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveNasabah} />
        </>
    );

    const deleteNasabahDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteNasabahDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteNasabah} />
        </>
    );

    const deleteNasabahsDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteNasabahsDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteSelectedNasabahs} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={nasabahs}
                        selection={selectedNasabahs}
                        onSelectionChange={(e) => setSelectedNasabahs(e.value)}
                        dataKey="ID"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} nasabahs"
                        globalFilter={globalFilter}
                        emptyMessage="No nasabahs found."
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
                        <Column field="Nama" header="Nama" sortable body={(rowData) => <span>{rowData.Nama}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="Kode" header="Kode" sortable body={(rowData) => <span>{rowData.Kode}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="Tgl" header="Tanggal" sortable body={(rowData) => <span>{new Date(rowData.Tgl).toLocaleDateString()}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="Telepon" header="Telepon" sortable body={(rowData) => <span>{rowData.Telepon}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={nasabahDialog} style={{ width: '450px' }} header="Nasabah Details" modal className="p-fluid" footer={nasabahDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="CabangEntry">Cabang Entry</label>
                            <InputText id="CabangEntry" value={nasabah.CabangEntry} onChange={(e) => onInputChange(e, 'CabangEntry')} required className={classNames({ 'p-invalid': submitted && !nasabah.CabangEntry })} />
                            {submitted && !nasabah.CabangEntry && <small className="p-invalid">Cabang Entry wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Nama">Nama</label>
                            <InputText id="Nama" value={nasabah.Nama} onChange={(e) => onInputChange(e, 'Nama')} required autoFocus className={classNames({ 'p-invalid': submitted && !nasabah.Nama })} />
                            {submitted && !nasabah.Nama && <small className="p-invalid">Nama wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Kode">Kode</label>
                            <InputText id="Kode" value={nasabah.Kode} onChange={(e) => onInputChange(e, 'Kode')} required className={classNames({ 'p-invalid': submitted && !nasabah.Kode })} />
                            {submitted && !nasabah.Kode && <small className="p-invalid">Kode wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="Tgl">Tanggal</label>
                            <Calendar id="Tgl" value={nasabah.Tgl} onChange={(e) => onDateChange(e, 'Tgl')} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                        </div>
                        <div className="field">
                            <label htmlFor="KodeLama">Kode Lama</label>
                            <InputText id="KodeLama" value={nasabah.KodeLama} onChange={(e) => onInputChange(e, 'KodeLama')} />
                        </div>
                        <div className="field">
                            <label htmlFor="TglLahir">Tanggal Lahir</label>
                            <Calendar id="TglLahir" value={nasabah.TglLahir} onChange={(e) => onDateChange(e, 'TglLahir')} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                        </div>
                        <div className="field">
                            <label htmlFor="TempatLahir">Tempat Lahir</label>
                            <InputText id="TempatLahir" value={nasabah.TempatLahir} onChange={(e) => onInputChange(e, 'TempatLahir')} />
                        </div>
                        <div className="field">
                            <label htmlFor="StatusPerkawinan">Status Perkawinan</label>
                            <Dropdown id="StatusPerkawinan" value={nasabah.StatusPerkawinan} options={statusPerkawinanOptions} onChange={(e) => onInputChange(e, 'StatusPerkawinan')} placeholder="Pilih Status Perkawinan" />
                        </div>
                        <div className="field">
                            <label htmlFor="KTP">KTP</label>
                            <InputText id="KTP" value={nasabah.KTP} onChange={(e) => onInputChange(e, 'KTP')} />
                        </div>
                        <div className="field">
                            <label htmlFor="Agama">Agama</label>
                            <InputText id="Agama" value={nasabah.Agama} onChange={(e) => onInputChange(e, 'Agama')} />
                        </div>
                        <div className="field">
                            <label htmlFor="Alamat">Alamat</label>
                            <InputText id="Alamat" value={nasabah.Alamat} onChange={(e) => onInputChange(e, 'Alamat')} />
                        </div>
                        <div className="field">
                            <label htmlFor="Telepon">Telepon</label>
                            <InputText id="Telepon" value={nasabah.Telepon} onChange={(e) => onInputChange(e, 'Telepon')} />
                        </div>
                        <div className="field">
                            <label htmlFor="Email">Email</label>
                            <InputText id="Email" value={nasabah.Email} onChange={(e) => onInputChange(e, 'Email')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteNasabahDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteNasabahDialogFooter} onHide={hideDeleteNasabahDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {nasabah && (
                                <span>
                                    Apakah Anda yakin ingin menghapus data nasabah <b>{nasabah.Nama}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteNasabahsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteNasabahsDialogFooter} onHide={hideDeleteNasabahsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedNasabahs && <span>Apakah Anda yakin ingin menghapus data-data nasabah terpilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default NasabahCrud;
