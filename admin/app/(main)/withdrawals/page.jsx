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
import WithdrawalApi from '@/services/WithdrawalApi';
import UserApi from '@/services/UserApi';
import BalanceApi from '@/services/BalanceApi';
import formatCurrency from '@/utils/currency';
import { InputTextarea } from 'primereact/inputtextarea';

const WithdrawalCrud = () => {
    let emptyWithdrawal = {
        id: null,
        reference: '',
        balance_id: null,
        user_id: null,
        amount: 0,
        status: '',
        collector_id: null,
        notes: '',
    };

    const [withdrawals, setWithdrawals] = useState(null);
    const [withdrawalDialog, setWithdrawalDialog] = useState(false);
    const [deleteWithdrawalDialog, setDeleteWithdrawalDialog] = useState(false);
    const [deleteWithdrawalsDialog, setDeleteWithdrawalsDialog] = useState(false);
    const [withdrawal, setWithdrawal] = useState(emptyWithdrawal);
    const [selectedWithdrawals, setSelectedWithdrawals] = useState(null);
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
    const [collectors, setCollectors] = useState([]);
    const [balances, setBalances] = useState([]);
    const [userBalances, setUserBalances] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);

    const statusOptions = [
        { label: 'Tertunda', value: 'pending' },
        { label: 'Sukses', value: 'success' },
        { label: 'Gagal', value: 'failed' }
    ];

    useEffect(() => {
        loadLazyData();
        loadUsers();
        loadBalances();
    }, [lazyParams]);

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await WithdrawalApi.getWithdrawals({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setWithdrawals(response.data.data);
            setTotalRecords(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error loading withdrawals:', error);
            setLoading(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data', life: 3000 });
        }
    };

    const loadUsers = async () => {
        try {
            const response = await UserApi.getUsers({ per_page: -1 });
            setUsers(response.data.map(user => ({ label: user.name, value: user.id })));
            setCollectors(response.data.filter(user => user.role === 'collector').map(user => ({ label: user.name, value: user.id })));
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadBalances = async () => {
        try {
            const response = await BalanceApi.getBalances({ per_page: -1 });
            setBalances(response.data.map(balance => ({ label: balance.code, value: balance.id, user: balance.user })));
        } catch (error) {
            console.error('Error loading balances:', error);
        }
    };

    const openNew = () => {
        setWithdrawal(emptyWithdrawal);
        setUserBalances([]);
        setSubmitted(false);
        setWithdrawalDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setWithdrawalDialog(false);
    };

    const hideDeleteWithdrawalDialog = () => {
        setDeleteWithdrawalDialog(false);
    };

    const hideDeleteWithdrawalsDialog = () => {
        setDeleteWithdrawalsDialog(false);
    };

    const saveWithdrawal = async () => {
        setSubmitted(true);

        if (withdrawal.reference.trim()) {
            try {
                if (withdrawal.id) {
                    await WithdrawalApi.updateWithdrawal(withdrawal.id, withdrawal);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data penarikan berhasil diubah', life: 3000 });
                } else {
                    await WithdrawalApi.createWithdrawal(withdrawal);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan penarikan baru', life: 3000 });
                }
                loadLazyData();
            } catch (error) {
                console.error('Error saving withdrawal:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data penarikan', life: 3000 });
            }

            setWithdrawalDialog(false);
            setWithdrawal(emptyWithdrawal);
        }
    };

    const editWithdrawal = (withdrawal) => {
        setWithdrawal({ ...withdrawal });

        if (withdrawal.user_id) {
            setUserBalances(balances.filter(balance => balance.user.id === withdrawal.user_id));
        }

        setWithdrawalDialog(true);
    };

    const confirmDeleteWithdrawal = (withdrawal) => {
        setWithdrawal(withdrawal);
        setDeleteWithdrawalDialog(true);
    };

    const deleteWithdrawal = async () => {
        try {
            await WithdrawalApi.deleteWithdrawal(withdrawal.id);
            loadLazyData();
            setDeleteWithdrawalDialog(false);
            setWithdrawal(emptyWithdrawal);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data penarikan berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting withdrawal:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data penarikan', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteWithdrawalsDialog(true);
    };

    const deleteSelectedWithdrawals = async () => {
        try {
            await WithdrawalApi.deleteMultipleWithdrawals(selectedWithdrawals.map(withdrawal => withdrawal.id));
            loadLazyData();
            setDeleteWithdrawalsDialog(false);
            setSelectedWithdrawals(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus penarikan terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple withdrawals:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus penarikan terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _withdrawal = { ...withdrawal };
        _withdrawal[`${name}`] = val;
        setWithdrawal(_withdrawal);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _withdrawal = { ...withdrawal };
        _withdrawal[`${name}`] = val;
        setWithdrawal(_withdrawal);
    };

    const onUserSelectChange = (e) => {
        const val = e.value || null;
        let _withdrawal = { ...withdrawal };
        _withdrawal['user_id'] = val;
        setWithdrawal(_withdrawal);

        if (val) {
            setUserBalances(balances.filter(balance => balance.user.id === val));
        } else {
            setUserBalances([]);
        }
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
                <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedWithdrawals || !selectedWithdrawals.length} />
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
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editWithdrawal(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteWithdrawal(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manajemen Penarikan</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." />
            </span>
        </div>
    );

    const withdrawalDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveWithdrawal} />
        </>
    );

    const deleteWithdrawalDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteWithdrawalDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteWithdrawal} />
        </>
    );

    const deleteWithdrawalsDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteWithdrawalsDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteSelectedWithdrawals} />
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
                        value={withdrawals}
                        selection={selectedWithdrawals}
                        onSelectionChange={(e) => setSelectedWithdrawals(e.value)}
                        dataKey="id"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} penarikan"
                        globalFilter={globalFilter}
                        emptyMessage="Tidak ada data penarikan yang ditemukan"
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
                        <Column field="user.name" header="Kustomer" sortable body={(rowData) => <span>{rowData.user?.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="balance.code" header="Nomor Rekening" sortable body={(rowData) => <span>{rowData.balance?.code}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="amount" header="Jumlah" sortable body={(rowData) => <span>{formatCurrency(rowData.amount)}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status" header="Status" sortable body={(rowData) => <span>{rowData.status}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="collector.name" header="Kolektor" sortable body={(rowData) => <span>{rowData.collector?.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={withdrawalDialog} style={{ width: '450px' }} header="Withdrawal Details" modal className="p-fluid" footer={withdrawalDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="reference">Kode Referensi</label>
                            <InputText id="reference" value={withdrawal.reference} onChange={(e) => onInputChange(e, 'reference')} required autoFocus className={classNames({ 'p-invalid': submitted && !withdrawal.reference })} />
                            {submitted && !withdrawal.reference && <small className="p-invalid">Kode Referensi wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="user_id">Kustomer</label>
                            <Dropdown
                                id="user_id"
                                value={withdrawal.user_id}
                                options={users}
                                onChange={(e) => onUserSelectChange(e)}
                                placeholder="Pilih Kustomer"
                                className={classNames({ 'p-invalid': submitted && !withdrawal.user_id })}
                            />
                            {submitted && !withdrawal.user_id && <small className="p-invalid">Kustomer wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="balance_id">Nomor Rekening</label>
                            <Dropdown
                                id="balance_id"
                                value={withdrawal.balance_id}
                                options={userBalances}
                                onChange={(e) => onInputChange(e, 'balance_id')}
                                placeholder="Pilih Nomor Rekening"
                                className={classNames({ 'p-invalid': submitted && !withdrawal.balance_id })}
                            />
                            {submitted && !withdrawal.balance_id && <small className="p-invalid">Nomor Rekening wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="amount">Jumlah</label>
                            <InputNumber id="amount" value={withdrawal.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown
                                id="status"
                                value={withdrawal.status}
                                options={statusOptions}
                                onChange={(e) => onInputChange(e, 'status')}
                                placeholder="Pilih Status"
                                className={classNames({ 'p-invalid': submitted && !withdrawal.status })}
                            />
                            {submitted && !withdrawal.status && <small className="p-invalid">Status wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="collector_id">Kolektor</label>
                            <Dropdown
                                id="collector_id"
                                value={withdrawal.collector_id}
                                options={collectors}
                                onChange={(e) => onInputChange(e, 'collector_id')}
                                placeholder="Pilih Kolektor"
                                className={classNames({ 'p-invalid': submitted && !withdrawal.collector_id })}
                            />
                            {submitted && !withdrawal.collector_id && <small className="p-invalid">Kolektor wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="notes">Catatan</label>
                            <InputTextarea id="notes" value={withdrawal.notes} onChange={(e) => onInputChange(e, 'notes')} rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteWithdrawalDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteWithdrawalDialogFooter} onHide={hideDeleteWithdrawalDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {withdrawal && (
                                <span>
                                    Apakah Anda yakin ingin menghapus penarikan <b>{withdrawal.user?.name}</b> dengan kode referensi <b>{withdrawal.reference}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteWithdrawalsDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteWithdrawalsDialogFooter} onHide={hideDeleteWithdrawalsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedWithdrawals && <span>Apakah Anda yakin ingin menghapus penarikan terpilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalCrud;