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
import UserApi from '@/services/UserApi';

const UserCrud = () => {
    let emptyUser = {
        id: null,
        name: '',
        email: '',
        role: '',
        password: '',
    };

    const [users, setUsers] = useState(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState(null);
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

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Kustomer', value: 'customer' },
        { label: 'Kolektor', value: 'collector' }
    ];

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await UserApi.getUsers({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setUsers(response.data.data);
            setTotalRecords(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error loading users:', error);
            setLoading(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data', life: 3000 });
        }
    };

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const saveUser = async () => {
        setSubmitted(true);

        if (user.name.trim() && user.email.trim() && user.role) {
            try {
                if (user.id) {
                    await UserApi.updateUser(user.id, user);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data anggota berhasil diubah', life: 3000 });
                } else {
                    await UserApi.createUser(user);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan anggota baru', life: 3000 });
                }
                loadLazyData();
            } catch (error) {
                console.error('Error saving user:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data anggota', life: 3000 });
            }

            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    const editUser = (user) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = async () => {
        try {
            await UserApi.deleteUser(user.id);
            loadLazyData();
            setDeleteUserDialog(false);
            setUser(emptyUser);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data anggota berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data anggota', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const deleteSelectedUsers = async () => {
        try {
            await UserApi.deleteMultipleUsers(selectedUsers.map(user => user.id));
            loadLazyData();
            setDeleteUsersDialog(false);
            setSelectedUsers(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus anggota terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple users:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus anggota terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;
        setUser(_user);
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
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
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
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manajemen Anggota</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveUser} />
        </>
    );

    const deleteUserDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );

    const deleteUsersDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteSelectedUsers} />
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
                        value={users}
                        selection={selectedUsers}
                        onSelectionChange={(e) => setSelectedUsers(e.value)}
                        dataKey="id"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        globalFilter={globalFilter}
                        emptyMessage="No users found."
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
                        <Column field="name" header="Nama" sortable body={(rowData) => <span>{rowData.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" sortable body={(rowData) => <span>{rowData.email}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="role" header="Peran" sortable body={(rowData) => <span>{rowData.role}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nama</label>
                            <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
                            {submitted && !user.name && <small className="p-invalid">Nama wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !user.email })} />
                            {submitted && !user.email && <small className="p-invalid">Email wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="role">Peran</label>
                            <Dropdown id="role" value={user.role} options={roleOptions} onChange={(e) => onInputChange(e, 'role')} placeholder="Select a Role" required className={classNames({ 'p-invalid': submitted && !user.role })} />
                            {submitted && !user.role && <small className="p-invalid">Peran wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="password">Kata Sandi</label>
                            <InputText id="password" type="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} required className={classNames({ 'p-invalid': submitted && !user.password })} />
                            {submitted && !user.password && <small className="p-invalid">Kata sandi wajib diisi.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                    Apakah Anda yakin ingin menghapus data <b>{user.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedUsers && <span>Apakah Anda yakin ingin menghapus data-data anggota terpilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default UserCrud;