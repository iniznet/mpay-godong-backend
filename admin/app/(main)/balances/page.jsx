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
import BalanceApi from '@/services/BalanceApi';
import MemberApi from '@/services/MemberApi';
import { InputNumber } from 'primereact/inputnumber';
import formatCurrency from '@/utils/currency';

const BalanceCrud = () => {
    let emptyBalance = {
        id: null,
        name: '',
        code: '',
        member_id: '',
        amount: '',
        status: '',
    };

    const [balances, setBalances] = useState(null);
    const [balanceDialog, setBalanceDialog] = useState(false);
    const [deleteBalanceDialog, setDeleteBalanceDialog] = useState(false);
    const [deleteBalancesDialog, setDeleteBalancesDialog] = useState(false);
    const [balance, setBalance] = useState(emptyBalance);
    const [members, setMembers] = useState([]);
    const [selectedBalances, setSelectedBalances] = useState(null);
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
        { label: 'Tertunda', value: 'pending' },
        { label: 'Aktif', value: 'active' },
        { label: 'Nonaktif', value: 'inactive' }
    ];

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await BalanceApi.getBalances({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setBalances(response.data.data);
            setTotalRecords(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error loading balances:', error);
            setLoading(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data', life: 3000 });
        }
    };

    const loadMembers = async () => {
        try {
            const response = await MemberApi.getMembers({ per_page: -1 });
            const formattedMembers = response.data.map(member => ({
                label: member.name,
                value: member.id
            }));
            setMembers(formattedMembers);
        } catch (error) {
            console.error('Error loading members:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat daftar anggota', life: 3000 });
        }
    };

    const openNew = () => {
        setBalance(emptyBalance);
        setSubmitted(false);
        setBalanceDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBalanceDialog(false);
    };

    const hideDeleteBalanceDialog = () => {
        setDeleteBalanceDialog(false);
    };

    const hideDeleteBalancesDialog = () => {
        setDeleteBalancesDialog(false);
    };

    const saveBalance = async () => {
        setSubmitted(true);

        try {
            if (balance.id) {
                await BalanceApi.updateBalance(balance.id, balance);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data rekening berhasil diubah', life: 3000 });
            } else {
                await BalanceApi.createBalance(balance);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan rekening baru', life: 3000 });
            }
            loadLazyData();

            setBalanceDialog(false);
            setBalance(emptyBalance);
        } catch (error) {
            console.error('Error saving balance:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data rekening', life: 3000 });
        }
    };

    const editBalance = (balance) => {
        setBalance({ ...balance });
        setBalanceDialog(true);
    };

    const confirmDeleteBalance = (balance) => {
        setBalance(balance);
        setDeleteBalanceDialog(true);
    };

    const deleteBalance = async () => {
        try {
            await BalanceApi.deleteBalance(balance.id);
            loadLazyData();
            setDeleteBalanceDialog(false);
            setBalance(emptyBalance);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data rekening berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting balance:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data rekening', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteBalancesDialog(true);
    };

    const deleteSelectedBalances = async () => {
        try {
            await BalanceApi.deleteMultipleBalances(selectedBalances.map(balance => balance.id));
            loadLazyData();
            setDeleteBalancesDialog(false);
            setSelectedBalances(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus rekening terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple balances:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus rekening terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _balance = { ...balance };
        _balance[`${name}`] = val;
        setBalance(_balance);
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
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedBalances || !selectedBalances.length} />
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
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editBalance(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteBalance(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manajemen Rekening Anggota</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." />
            </span>
        </div>
    );

    const balanceDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveBalance} />
        </>
    );

    const deleteBalanceDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteBalanceDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteBalance} />
        </>
    );

    const deleteBalancesDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteBalancesDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteSelectedBalances} />
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
                        value={balances}
                        selection={selectedBalances}
                        onSelectionChange={(e) => setSelectedBalances(e.value)}
                        dataKey="id"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} balances"
                        globalFilter={globalFilter}
                        emptyMessage="No balances found."
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
                        <Column field="member.name" header="Nama Anggota" sortable body={(rowData) => <span>{rowData.member.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Nama Rekening" sortable body={(rowData) => <span>{rowData.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="code" header="Nomor Rekening" sortable body={(rowData) => <span>{rowData.code}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="amount" header="Jumlah" sortable body={(rowData) => <span>{formatCurrency(rowData.amount)}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Status" sortable body={(rowData) => <span>{rowData.status}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={balanceDialog} style={{ width: '450px' }} header="Balance Details" modal className="p-fluid" footer={balanceDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="member_id">Nama Anggota</label>
                            <Dropdown
                                id="member_id"
                                value={balance.member_id}
                                options={members}
                                onChange={(e) => onInputChange(e, 'member_id')}
                                placeholder="Pilih Anggota"
                                className={classNames({ 'p-invalid': submitted && !balance.member_id })}
                            />
                            {submitted && !balance.member_id && <small className="p-invalid">Anggota wajib dipilih.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Nama Rekening</label>
                            <InputText id="name" value={balance.name} onChange={(e) => onInputChange(e, 'name')} required className={classNames({ 'p-invalid': submitted && !balance.name })} />
                            {submitted && !balance.name && <small className="p-invalid">Nama Rekening wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="code">Nomor Rekening</label>
                            <InputText id="code" value={balance.code} onChange={(e) => onInputChange(e, 'code')} required className={classNames({ 'p-invalid': submitted && !balance.code })} />
                            {submitted && !balance.code && <small className="p-invalid">Nomor Rekening wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="amount">Saldo</label>
                            <InputNumber id="amount" value={balance.amount} onValueChange={(e) => onInputChange(e, 'amount')} mode="currency" currency="IDR" locale="id-ID" required className={classNames({ 'p-invalid': submitted && !balance.amount })} />
                            {submitted && !balance.amount && <small className="p-invalid">Jumlah wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown id="status" value={balance.status} options={statusOptions} onChange={(e) => onInputChange(e, 'status')} placeholder="Pilih Status" required className={classNames({ 'p-invalid': submitted && !balance.status })} />
                            {submitted && !balance.status && <small className="p-invalid">Status wajib diisi.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBalanceDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBalanceDialogFooter} onHide={hideDeleteBalanceDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {balance && (
                                <span>
                                    Apakah Anda yakin ingin menghapus data rekening untuk anggota <b>{balance.member?.name}</b> dengan saldo <b>{formatCurrency(balance.amount)}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteBalancesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBalancesDialogFooter} onHide={hideDeleteBalancesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedBalances && <span>Apakah Anda yakin ingin menghapus data-data rekening terpilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default BalanceCrud;
