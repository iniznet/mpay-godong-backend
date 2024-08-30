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
import DepositApi from '@/services/DepositApi';
import MemberApi from '@/services/MemberApi';
import BalanceApi from '@/services/BalanceApi';
import formatCurrency from '@/utils/currency';
import { InputTextarea } from 'primereact/inputtextarea';

const DepositCrud = () => {
    let emptyDeposit = {
        id: null,
        reference: '',
        balance_id: null,
        member_id: null,
        amount: 0,
        status: '',
        collector_id: null,
        notes: '',
    };

    const [deposits, setDeposits] = useState(null);
    const [depositDialog, setDepositDialog] = useState(false);
    const [deleteDepositDialog, setDeleteDepositDialog] = useState(false);
    const [deleteDepositsDialog, setDeleteDepositsDialog] = useState(false);
    const [deposit, setDeposit] = useState(emptyDeposit);
    const [selectedDeposits, setSelectedDeposits] = useState(null);
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
    const [members, setMembers] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const [balances, setBalances] = useState([]);
    const [memberBalances, setMemberBalances] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);

    const statusOptions = [
        { label: 'Tertunda', value: 'pending' },
        { label: 'Sukses', value: 'success' },
        { label: 'Gagal', value: 'failed' }
    ];

    useEffect(() => {
        loadLazyData();
        loadMembers();
        loadBalances();
    }, [lazyParams]);

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await DepositApi.getDeposits({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setDeposits(response.data.data);
            setTotalRecords(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error loading deposits:', error);
            setLoading(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data', life: 3000 });
        }
    };

    const loadMembers = async () => {
        try {
            const response = await MemberApi.getMembers({ per_page: -1 });
            setMembers(response.data.map(member => ({ label: member.name, value: member.id })));
            setCollectors(response.data.filter(member => member.role === 'collector').map(member => ({ label: member.name, value: member.id })));
        } catch (error) {
            console.error('Error loading members:', error);
        }
    };

    const loadBalances = async () => {
        try {
            const response = await BalanceApi.getBalances({ per_page: -1 });
            setBalances(response.data.map(balance => ({ label: balance.code, value: balance.id, member: balance.member })));
        } catch (error) {
            console.error('Error loading balances:', error);
        }
    };

    const openNew = () => {
        setDeposit(emptyDeposit);
        setMemberBalances([]);
        setSubmitted(false);
        setDepositDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setDepositDialog(false);
    };

    const hideDeleteDepositDialog = () => {
        setDeleteDepositDialog(false);
    };

    const hideDeleteDepositsDialog = () => {
        setDeleteDepositsDialog(false);
    };

    const saveDeposit = async () => {
        setSubmitted(true);

        if (deposit.reference.trim()) {
            try {
                if (deposit.id) {
                    await DepositApi.updateDeposit(deposit.id, deposit);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data setoran berhasil diubah', life: 3000 });
                } else {
                    await DepositApi.createDeposit(deposit);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan setoran baru', life: 3000 });
                }
                loadLazyData();
            } catch (error) {
                console.error('Error saving deposit:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data setoran', life: 3000 });
            }

            setDepositDialog(false);
            setDeposit(emptyDeposit);
        }
    };

    const editDeposit = (deposit) => {
        setDeposit({ ...deposit });

        if (deposit.member_id) {
            setMemberBalances(balances.filter(balance => balance.member.id === deposit.member_id));
        }

        setDepositDialog(true);
    };

    const confirmDeleteDeposit = (deposit) => {
        setDeposit(deposit);
        setDeleteDepositDialog(true);
    };

    const deleteDeposit = async () => {
        try {
            await DepositApi.deleteDeposit(deposit.id);
            loadLazyData();
            setDeleteDepositDialog(false);
            setDeposit(emptyDeposit);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data setoran berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting deposit:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data setoran', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteDepositsDialog(true);
    };

    const deleteSelectedDeposits = async () => {
        try {
            await DepositApi.deleteMultipleDeposits(selectedDeposits.map(deposit => deposit.id));
            loadLazyData();
            setDeleteDepositsDialog(false);
            setSelectedDeposits(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus setoran terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple deposits:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus setoran terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _deposit = { ...deposit };
        _deposit[`${name}`] = val;
        setDeposit(_deposit);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _deposit = { ...deposit };
        _deposit[`${name}`] = val;
        setDeposit(_deposit);
    };

    const onMemberSelectChange = (e) => {
        const val = e.value || null;
        let _deposit = { ...deposit };
        _deposit['member_id'] = val;
        setDeposit(_deposit);

        if (val) {
            setMemberBalances(balances.filter(balance => balance.member.id === val));
        } else {
            setMemberBalances([]);
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
                <Button label="Hapus" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedDeposits || !selectedDeposits.length} />
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
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editDeposit(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteDeposit(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manajemen Setoran</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." />
            </span>
        </div>
    );

    const depositDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveDeposit} />
        </>
    );

    const deleteDepositDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteDepositDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteDeposit} />
        </>
    );

    const deleteDepositsDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteDepositsDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteSelectedDeposits} />
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
                        value={deposits}
                        selection={selectedDeposits}
                        onSelectionChange={(e) => setSelectedDeposits(e.value)}
                        dataKey="id"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} setoran"
                        globalFilter={globalFilter}
                        emptyMessage="Tidak ada data setoran yang ditemukan"
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
                        <Column field="member.name" header="Kustomer" sortable body={(rowData) => <span>{rowData.member?.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="balance.code" header="Nomor Rekening" sortable body={(rowData) => <span>{rowData.balance?.code}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="amount" header="Jumlah" sortable body={(rowData) => <span>{formatCurrency(rowData.amount)}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status" header="Status" sortable body={(rowData) => <span>{rowData.status}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="collector.name" header="Kolektor" sortable body={(rowData) => <span>{rowData.collector?.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={depositDialog} style={{ width: '450px' }} header="Deposit Details" modal className="p-fluid" footer={depositDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="reference">Kode Referensi</label>
                            <InputText id="reference" value={deposit.reference} onChange={(e) => onInputChange(e, 'reference')} required autoFocus className={classNames({ 'p-invalid': submitted && !deposit.reference })} />
                            {submitted && !deposit.reference && <small className="p-invalid">Kode Referensi wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="member_id">Kustomer</label>
                            <Dropdown
                                id="member_id"
                                value={deposit.member_id}
                                options={members}
                                onChange={(e) => onMemberSelectChange(e)}
                                placeholder="Pilih Kustomer"
                                className={classNames({ 'p-invalid': submitted && !deposit.member_id })}
                            />
                            {submitted && !deposit.member_id && <small className="p-invalid">Kustomer wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="balance_id">Nomor Rekening</label>
                            <Dropdown
                                id="balance_id"
                                value={deposit.balance_id}
                                options={memberBalances}
                                onChange={(e) => onInputChange(e, 'balance_id')}
                                placeholder="Pilih Nomor Rekening"
                                className={classNames({ 'p-invalid': submitted && !deposit.balance_id })}
                            />
                            {submitted && !deposit.balance_id && <small className="p-invalid">Nomor Rekening wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="amount">Jumlah</label>
                            <InputNumber id="amount" value={deposit.amount} onValueChange={(e) => onInputNumberChange(e, 'amount')} mode="currency" currency="IDR" locale="id-ID" />
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown
                                id="status"
                                value={deposit.status}
                                options={statusOptions}
                                onChange={(e) => onInputChange(e, 'status')}
                                placeholder="Pilih Status"
                                className={classNames({ 'p-invalid': submitted && !deposit.status })}
                            />
                            {submitted && !deposit.status && <small className="p-invalid">Status wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="collector_id">Kolektor</label>
                            <Dropdown
                                id="collector_id"
                                value={deposit.collector_id}
                                options={collectors}
                                onChange={(e) => onInputChange(e, 'collector_id')}
                                placeholder="Pilih Kolektor"
                                className={classNames({ 'p-invalid': submitted && !deposit.collector_id })}
                            />
                            {submitted && !deposit.collector_id && <small className="p-invalid">Kolektor wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="notes">Catatan</label>
                            <InputTextarea id="notes" value={deposit.notes} onChange={(e) => onInputChange(e, 'notes')} rows={3} cols={20} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDepositDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteDepositDialogFooter} onHide={hideDeleteDepositDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {deposit && (
                                <span>
                                    Apakah Anda yakin ingin menghapus setoran <b>{deposit.member?.name}</b> dengan kode referensi <b>{deposit.reference}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteDepositsDialog} style={{ width: '450px' }} header="Konfirmasi" modal footer={deleteDepositsDialogFooter} onHide={hideDeleteDepositsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedDeposits && <span>Apakah Anda yakin ingin menghapus setoran terpilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default DepositCrud;
