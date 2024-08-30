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
import DebtApi from '@/services/DebtApi';
import UserApi from '@/services/UserApi';
import formatCurrency from '@/utils/currency';
import { InputTextarea } from 'primereact/inputtextarea';

const DebtCrud = () => {
    let emptyDebt = {
        id: null,
        reference: '',
        user_id: null,
        amount: 0,
        interest_rate: 0,
        status: '',
        notes: '',
    };

    const [debts, setDebts] = useState(null);
    const [debtDialog, setDebtDialog] = useState(false);
    const [deleteDebtDialog, setDeleteDebtDialog] = useState(false);
    const [deleteDebtsDialog, setDeleteDebtsDialog] = useState(false);
    const [debt, setDebt] = useState(emptyDebt);
    const [selectedDebts, setSelectedDebts] = useState(null);
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
    const [users, setUsers] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);

    const statusOptions = [
        { label: 'Tertunda', value: 'pending' },
        { label: 'Disetujui', value: 'approved' },
        { label: 'Ditolak', value: 'rejected' },
        { label: 'Lunas', value: 'paid' }
    ];

    useEffect(() => {
        loadLazyData();
        loadUsers();
    }, [lazyParams]);

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await DebtApi.getDebts({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setDebts(response.data.data);
            setTotalRecords(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error loading debts:', error);
            setLoading(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data', life: 3000 });
        }
    };

    const loadUsers = async () => {
        try {
            const response = await UserApi.getUsers({ per_page: -1 });
            setUsers(response.data.map(user => ({ label: user.name, value: user.id })));
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const openNew = () => {
        setDebt(emptyDebt);
        setSubmitted(false);
        setDebtDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDebtDialog(false);
    };

    const hideDeleteDebtDialog = () => {
        setDeleteDebtDialog(false);
    };

    const hideDeleteDebtsDialog = () => {
        setDeleteDebtsDialog(false);
    };

    const saveDebt = async () => {
        setSubmitted(true);

        if (debt.reference.trim()) {
            try {
                if (debt.id) {
                    await DebtApi.updateDebt(debt.id, debt);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data pinjaman berhasil diubah', life: 3000 });
                } else {
                    await DebtApi.createDebt(debt);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan pinjaman baru', life: 3000 });
                }
                loadLazyData();
            } catch (error) {
                console.error('Error saving debt:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data pinjaman', life: 3000 });
            }

            setDebtDialog(false);
            setDebt(emptyDebt);
        }
    };

    const editDebt = (debt) => {
        setDebt({ ...debt });
        setDebtDialog(true);
    };

    const confirmDeleteDebt = (debt) => {
        setDebt(debt);
        setDeleteDebtDialog(true);
    };

    const deleteDebt = async () => {
        try {
            await DebtApi.deleteDebt(debt.id);
            loadLazyData();
            setDeleteDebtDialog(false);
            setDebt(emptyDebt);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data pinjaman berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting debt:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data pinjaman', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteDebtsDialog(true);
    };

    const deleteSelectedDebts = async () => {
        try {
            await DebtApi.deleteMultipleDebts(selectedDebts.map(debt => debt.id));
            loadLazyData();
            setDeleteDebtsDialog(false);
            setSelectedDebts(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus pinjaman terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple debts:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus pinjaman terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _debt = { ...debt };
        _debt[`${name}`] = val;
        setDebt(_debt);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _debt = { ...debt };
        _debt[`${name}`] = val;
        setDebt(_debt);
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
                <Button label="Tambah" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedDebts || !selectedDebts.length} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Ekspor" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editDebt(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteDebt(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manajemen Pinjaman</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." />
            </span>
        </div>
    );

    const debtDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveDebt} />
        </>
    );

    const deleteDebtDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteDebtDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteDebt} />
        </>
    );

    const deleteDebtsDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteDebtsDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteSelectedDebts} />
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
                        value={debts}
                        selection={selectedDebts}
                        onSelectionChange={(e) => setSelectedDebts(e.value)}
                        dataKey="id"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} pinjaman"
                        globalFilter={globalFilter}
                        emptyMessage="Tidak ada data pinjaman yang ditemukan"
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
                        <Column field="reference" header="Kode Referensi" sortable body={(rowData) => <span>{rowData.reference}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="user.name" header="Peminjam" sortable body={(rowData) => <span>{rowData.user?.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="amount" header="Jumlah" sortable body={(rowData) => <span>{formatCurrency(rowData.amount)}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="interest_rate" header="Suku Bunga" sortable body={(rowData) => <span>{rowData.interest_rate}%</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status" header="Status" sortable body={(rowData) => <span>{rowData.status}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={debtDialog} style={{ width: '450px' }} header="Detail Pinjaman" modal className="p-fluid" footer={debtDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="reference">Kode Referensi</label>
                            <InputText id="reference" value={debt.reference} onChange={(e) => onInputChange(e, 'reference')} required autoFocus className={classNames({ 'p-invalid': submitted && !debt.reference })} />
                            {submitted && !debt.reference && <small className="p-invalid">Kode Referensi wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="user_id">Peminjam</label>
                            <Dropdown
                                id="user_id"
                                value={debt.user_id}
                                options={users}
                                onChange={(e) => onInputChange(e, 'user_id')}
                                placeholder="Pilih Peminjam"
                                className={classNames({ 'p-invalid': submitted && !debt.user_id })}
                            />
                            {submitted && !debt.user_id && <small className="p-invalid">Peminjam wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="amount">Jumlah</label>
                            <InputNumber id="amount" value={debt.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                        <div className="field">
                            <label htmlFor="interest_rate">Suku Bunga (%)</label>
                            <InputNumber id="interest_rate" value={debt.interest_rate} onValueChange={(e) => onInputNumberChange(e, 'interest_rate')} mode="decimal" minFractionDigits={2} maxFractionDigits={2} />
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown
                                id="status"
                                value={debt.status}
                                options={statusOptions}
                                onChange={(e) => onInputChange(e, 'status')}
                                placeholder="Pilih Status"
                                className={classNames({ 'p-invalid': submitted && !debt.status })}
                            />
                            {submitted && !debt.status && <small className="p-invalid">Status wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="notes">Catatan</label>
                            <InputTextarea id="notes" value={debt.notes} onChange={(e) => onInputChange(e, 'notes')} rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDebtDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteDebtDialogFooter} onHide={hideDeleteDebtDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {debt && (
                                <span>
                                    Apakah Anda yakin ingin menghapus pinjaman <b>{debt.user?.name}</b> dengan kode referensi <b>{debt.reference}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDebtsDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteDebtsDialogFooter} onHide={hideDeleteDebtsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedDebts && <span>Apakah Anda yakin ingin menghapus pinjaman terpilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default DebtCrud;