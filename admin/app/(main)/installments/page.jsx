'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import InstallmentApi from '@/services/InstallmentApi';

const AngsuranCrud = () => {
    let emptyInstallment = {
        id: null,
        reference: '',
        debt_id: null,
        principal: 0,
        interest: 0,
        remaining: 0,
        month: 1,
        due_date: null,
        paid_at: null,
        notes: '',
        status: '',
        collector_id: null,
    };

    const [installments, setInstallments] = useState(null);
    const [installmentDialog, setInstallmentDialog] = useState(false);
    const [deleteInstallmentDialog, setDeleteInstallmentDialog] = useState(false);
    const [deleteInstallmentsDialog, setDeleteInstallmentsDialog] = useState(false);
    const [installment, setInstallment] = useState(emptyInstallment);
    const [selectedInstallments, setSelectedInstallments] = useState(null);
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

    const statusOptions = [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' }
    ];

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await InstallmentApi.getInstallments({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setInstallments(response.data.data);
            setTotalRecords(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error loading installments:', error);
            setLoading(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data', life: 3000 });
        }
    };

    const openNew = () => {
        setInstallment(emptyInstallment);
        setSubmitted(false);
        setInstallmentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setInstallmentDialog(false);
    };

    const hideDeleteInstallmentDialog = () => {
        setDeleteInstallmentDialog(false);
    };

    const hideDeleteInstallmentsDialog = () => {
        setDeleteInstallmentsDialog(false);
    };

    const saveInstallment = async () => {
        setSubmitted(true);

        if (installment.reference.trim()) {
            try {
                if (installment.id) {
                    await InstallmentApi.updateInstallment(installment.id, installment);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data angsuran berhasil diubah', life: 3000 });
                } else {
                    await InstallmentApi.createInstallment(installment);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan angsuran baru', life: 3000 });
                }
                loadLazyData();
                setInstallmentDialog(false);
                setInstallment(emptyInstallment);
            } catch (error) {
                console.error('Error saving installment:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data angsuran', life: 3000 });
            }
        }
    };

    const editInstallment = (installment) => {
        setInstallment({ ...installment });
        setInstallmentDialog(true);
    };

    const confirmDeleteInstallment = (installment) => {
        setInstallment(installment);
        setDeleteInstallmentDialog(true);
    };

    const deleteInstallment = async () => {
        try {
            await InstallmentApi.deleteInstallment(installment.id);
            loadLazyData();
            setDeleteInstallmentDialog(false);
            setInstallment(emptyInstallment);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data angsuran berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting installment:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data angsuran', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteInstallmentsDialog(true);
    };

    const deleteSelectedInstallments = async () => {
        try {
            await InstallmentApi.deleteMultipleInstallments(selectedInstallments.map(installment => installment.id));
            loadLazyData();
            setDeleteInstallmentsDialog(false);
            setSelectedInstallments(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus angsuran terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple installments:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus angsuran terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _installment = { ...installment };
        _installment[`${name}`] = val;
        setInstallment(_installment);
    };

    const onDateChange = (e, name) => {
        let _installment = { ...installment };
        _installment[`${name}`] = e.value;
        setInstallment(_installment);
    };

    const onPageChange = (event) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,
            rows: event.rows,
            page: event.page + 1
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedInstallments || !selectedInstallments.length} />
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
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editInstallment(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteInstallment(rowData)} />
            </>
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

    const installmentDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveInstallment} />
        </>
    );

    const deleteInstallmentDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteInstallmentDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteInstallment} />
        </>
    );

    const deleteInstallmentsDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteInstallmentsDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteSelectedInstallments} />
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
                        value={installments}
                        selection={selectedInstallments}
                        onSelectionChange={(e) => setSelectedInstallments(e.value)}
                        dataKey="id"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} installments"
                        globalFilter={globalFilter}
                        emptyMessage="No installments found."
                        header={header}
                        responsiveLayout="scroll"
                        lazy
                        totalRecords={totalRecords}
                        loading={loading}
                        first={lazyParams.first}
                        onPage={onPageChange}
                        onSort={(e) => setLazyParams({ ...lazyParams, ...e })}
                        onFilter={(e) => setLazyParams({ ...lazyParams, ...e })}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="reference" header="Kode" sortable body={(rowData) => <span>{rowData.reference}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="principal" header="Pokok" sortable body={(rowData) => <span>{rowData.principal}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="interest" header="Bunga" sortable body={(rowData) => <span>{rowData.interest}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="remaining" header="Sisa" sortable body={(rowData) => <span>{rowData.remaining}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="month" header="Bulan" sortable body={(rowData) => <span>{rowData.month}</span>} headerStyle={{ minWidth: '8rem' }}></Column>
                        <Column field="due_date" header="Tenggat" sortable body={(rowData) => <span>{new Date(rowData.due_date).toLocaleDateString()}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status" header="Status" sortable body={(rowData) => <span>{rowData.status}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={installmentDialog} style={{ width: '450px' }} header="Installment Details" modal className="p-fluid" footer={installmentDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="reference">Kode Transaksi</label>
                            <InputText id="reference" value={installment.reference} onChange={(e) => onInputChange(e, 'reference')} required autoFocus className={classNames({ 'p-invalid': submitted && !installment.reference })} />
                            {submitted && !installment.reference && <small className="p-invalid">Reference is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="principal">Pokok</label>
                            <InputText id="principal" value={installment.principal} onChange={(e) => onInputChange(e, 'principal')} required keyfilter="num" className={classNames({ 'p-invalid': submitted && !installment.principal })} />
                            {submitted && !installment.principal && <small className="p-invalid">Principal is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="interest">Bunga</label>
                            <InputText id="interest" value={installment.interest} onChange={(e) => onInputChange(e, 'interest')} required keyfilter="num" className={classNames({ 'p-invalid': submitted && !installment.interest })} />
                            {submitted && !installment.interest && <small className="p-invalid">Interest is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="remaining">Sisa</label>
                            <InputText id="remaining" value={installment.remaining} onChange={(e) => onInputChange(e, 'remaining')} required keyfilter="num" className={classNames({ 'p-invalid': submitted && !installment.remaining })} />
                            {submitted && !installment.remaining && <small className="p-invalid">Remaining is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="month">Bulan</label>
                            <InputText id="month" value={installment.month} onChange={(e) => onInputChange(e, 'month')} required keyfilter="int" className={classNames({ 'p-invalid': submitted && !installment.month })} />
                            {submitted && !installment.month && <small className="p-invalid">Month is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="due_date">Tanggal Tenggat</label>
                            <Calendar id="due_date" value={installment.due_date} onChange={(e) => onDateChange(e, 'due_date')} showIcon required className={classNames({ 'p-invalid': submitted && !installment.due_date })} />
                            {submitted && !installment.due_date && <small className="p-invalid">Due Date is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown id="status" value={installment.status} options={statusOptions} onChange={(e) => onInputChange(e, 'status')} placeholder="Select Status" required className={classNames({ 'p-invalid': submitted && !installment.status })} />
                            {submitted && !installment.status && <small className="p-invalid">Status is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="notes">Catatan</label>
                            <InputText id="notes" value={installment.notes} onChange={(e) => onInputChange(e, 'notes')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteInstallmentDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteInstallmentDialogFooter} onHide={hideDeleteInstallmentDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {installment && (
                                <span>
                                    Are you sure you want to delete <b>{installment.reference}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteInstallmentsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteInstallmentsDialogFooter} onHide={hideDeleteInstallmentsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedInstallments && <span>Are you sure you want to delete the selected installments?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default AngsuranCrud;
