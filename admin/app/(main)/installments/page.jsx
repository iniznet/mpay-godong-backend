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
import { InputNumber } from 'primereact/inputnumber';
import InstallmentApi from '@/services/InstallmentApi';
import UserApi from '@/services/UserApi';
import DebtApi from '@/services/DebtApi';
import formatCurrency from '@/utils/currency';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';

const InstallmentCrud = () => {
    let emptyInstallment = {
        id: null,
        reference: '',
        debt_id: null,
        amount: 0,
        due_date: '',
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
    const [debts, setDebts] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);

    const statusOptions = [
        { label: 'Tertunda', value: 'pending' },
        { label: 'Parsial', value: 'partial' },
        { label: 'Dibayar', value: 'paid' },
        { label: 'Lewat Jatuh Tempo', value: 'overdue' },
        { label: 'Dibatalkan', value: 'cancelled' }
    ];

    useEffect(() => {
        loadLazyData();
        loadDebts();
        loadCollectors();
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

    const loadDebts = async () => {
        try {
            const response = await DebtApi.getDebts({ per_page: 100 });
            setDebts(response.data.data);
        } catch (error) {
            console.error('Error loading debts:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data hutang', life: 3000 });
        }
    };

    const loadCollectors = async () => {
        try {
            const response = await UserApi.getUsers({ per_page: 100 });
            setCollectors(response.data.data);
        } catch (error) {
            console.error('Error loading collectors:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data kolektor', life: 3000 });
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

        if (!installment.debt_id || !installment.reference || installment.amount <= 0 || !installment.due_date || !installment.status) {
            return;
        }

        try {
            let response;
            if (installment.id) {
                response = await InstallmentApi.updateInstallment(installment.id, installment);
            } else {
                response = await InstallmentApi.createInstallment(installment);
            }
            toast.current.show({ severity: 'success', summary: 'Sukses', detail: 'Data angsuran berhasil disimpan', life: 3000 });
            loadLazyData();
            setInstallmentDialog(false);
            setInstallment(emptyInstallment);
        } catch (error) {
            console.error('Error saving installment:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data angsuran', life: 3000 });
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
            toast.current.show({ severity: 'success', summary: 'Sukses', detail: 'Data angsuran berhasil dihapus', life: 3000 });
            loadLazyData();
            setDeleteInstallmentDialog(false);
            setInstallment(emptyInstallment);
        } catch (error) {
            console.error('Error deleting installment:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data angsuran', life: 3000 });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteInstallmentsDialog(true);
    };

    const deleteSelectedInstallments = async () => {
        const ids = selectedInstallments.map((installment) => installment.id);
        try {
            await InstallmentApi.deleteInstallments(ids);
            toast.current.show({ severity: 'success', summary: 'Sukses', detail: 'Data angsuran berhasil dihapus', life: 3000 });
            loadLazyData();
            setDeleteInstallmentsDialog(false);
            setSelectedInstallments(null);
        } catch (error) {
            console.error('Error deleting installments:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data angsuran', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _installment = { ...installment };
        _installment[`${name}`] = val;

        setInstallment(_installment);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _installment = { ...installment };
        _installment[`${name}`] = val;

        setInstallment(_installment);
    };

    const onLazyLoad = (event) => {
        setLazyParams({
            ...lazyParams,
            first: event.first,
            rows: event.rows,
            page: event.page + 1,
            sortField: event.sortField,
            sortOrder: event.sortOrder,
        });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Tambah" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                <Button label="Hapus" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedInstallments || !selectedInstallments.length} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Ekspor" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const installmentDialogFooter = (
        <React.Fragment>
            <Button label="Batal" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" className="p-button-text" onClick={saveInstallment} />
        </React.Fragment>
    );

    const deleteInstallmentDialogFooter = (
        <React.Fragment>
            <Button label="Tidak" icon="pi pi-times" className="p-button-text" onClick={hideDeleteInstallmentDialog} />
            <Button label="Ya" icon="pi pi-check" className="p-button-text" onClick={deleteInstallment} />
        </React.Fragment>
    );

    const deleteInstallmentsDialogFooter = (
        <React.Fragment>
            <Button label="Tidak" icon="pi pi-times" className="p-button-text" onClick={hideDeleteInstallmentsDialog} />
            <Button label="Ya" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedInstallments} />
        </React.Fragment>
    );

    const installmentAmountTemplate = (rowData) => {
        return formatCurrency(rowData.amount);
    };

    const installmentDueDateTemplate = (rowData) => {
        return new Date(rowData.due_date).toLocaleDateString();
    };

    const installmentPaidAtTemplate = (rowData) => {
        return rowData.paid_at ? new Date(rowData.paid_at).toLocaleDateString() : 'Belum Dibayar';
    };

    const installmentStatusTemplate = (rowData) => {
        const statusLabels = {
            pending: 'Tertunda',
            partial: 'Parsial',
            paid: 'Dibayar',
            overdue: 'Lewat Jatuh Tempo',
            cancelled: 'Dibatalkan'
        };
        return statusLabels[rowData.status];
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editInstallment(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteInstallment(rowData)} />
            </React.Fragment>
        );
    };

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                <DataTable ref={dt} value={installments} selection={selectedInstallments} onSelectionChange={(e) => setSelectedInstallments(e.value)}
                    dataKey="id" paginator rows={lazyParams.rows} totalRecords={totalRecords} lazy
                    first={lazyParams.first} onPage={onLazyLoad} loading={loading} globalFilter={globalFilter}
                    header={<div className="table-header">
                        <h5 className="mx-0 my-1">Manajemen Angsuran</h5>
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." />
                        </span>
                    </div>}
                    responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                    <Column field="reference" header="Referensi" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="debt.reference" header="Referensi Hutang" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="amount" header="Jumlah" body={installmentAmountTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="due_date" header="Jatuh Tempo" body={installmentDueDateTemplate} sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="paid_at" header="Dibayar Pada" body={installmentPaidAtTemplate} sortable style={{ minWidth: '10rem' }}></Column>
                    <Column field="status" header="Status" body={installmentStatusTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={installmentDialog} style={{ width: '450px' }} header="Detail Angsuran" modal className="p-fluid" footer={installmentDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="debt_id">Hutang</label>
                    <Dropdown id="debt_id" value={installment.debt_id} options={debts} onChange={(e) => onInputChange(e, 'debt_id')} optionLabel="reference" placeholder="Pilih Hutang" />
                    {submitted && !installment.debt_id && <small className="p-error">Hutang wajib dipilih.</small>}
                </div>
                <div className="field">
                    <label htmlFor="reference">Referensi</label>
                    <InputText id="reference" value={installment.reference} onChange={(e) => onInputChange(e, 'reference')} required autoFocus className={submitted && !installment.reference ? 'p-invalid' : ''} />
                    {submitted && !installment.reference && <small className="p-error">Referensi wajib diisi.</small>}
                </div>
                <div className="field">
                    <label htmlFor="amount">Jumlah</label>
                    <InputNumber id="amount" value={installment.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')} mode="currency" currency="IDR" locale="id-ID" />
                    {submitted && installment.amount <= 0 && <small className="p-error">Jumlah harus lebih dari 0.</small>}
                </div>
                <div className="field">
                    <label htmlFor="due_date">Jatuh Tempo</label>
                    <Calendar id="due_date" value={new Date(installment.due_date)} onChange={(e) => onInputChange(e, 'due_date')} dateFormat="dd/mm/yy" showIcon />
                    {submitted && !installment.due_date && <small className="p-error">Jatuh tempo wajib diisi.</small>}
                </div>
                <div className="field">
                    <label htmlFor="status">Status</label>
                    <Dropdown id="status" value={installment.status} options={statusOptions} onChange={(e) => onInputChange(e, 'status')} placeholder="Pilih Status" />
                    {submitted && !installment.status && <small className="p-error">Status wajib dipilih.</small>}
                </div>
            </Dialog>

            <Dialog visible={deleteInstallmentDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteInstallmentDialogFooter} onHide={hideDeleteInstallmentDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {installment && <span>Apakah Anda yakin ingin menghapus angsuran dengan referensi <b>{installment.reference}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteInstallmentsDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteInstallmentsDialogFooter} onHide={hideDeleteInstallmentsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {installment && <span>Apakah Anda yakin ingin menghapus angsuran terpilih?</span>}
                </div>
            </Dialog>
        </div>
    );
};

export default InstallmentCrud;
