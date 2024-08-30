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
import MemberApi from '@/services/MemberApi';
import { Image } from 'primereact/image';

const MemberCrud = () => {
    let emptyMember = {
        id: null,
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        latitude: '',
        longitude: '',
        status: '',
        avatar: null,
    };

    const [members, setMembers] = useState(null);
    const [memberDialog, setMemberDialog] = useState(false);
    const [deleteMemberDialog, setDeleteMemberDialog] = useState(false);
    const [deleteMembersDialog, setDeleteMembersDialog] = useState(false);
    const [member, setMember] = useState(emptyMember);
    const [selectedMembers, setSelectedMembers] = useState(null);
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
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
    ];

    useEffect(() => {
        loadLazyData();
    }, [lazyParams]);

    const loadLazyData = async () => {
        setLoading(true);
        try {
            const response = await MemberApi.getMembers({
                page: lazyParams.page,
                per_page: lazyParams.rows,
                sort_field: lazyParams.sortField,
                sort_order: lazyParams.sortOrder,
                search: globalFilter
            });
            setMembers(response.data.data);
            setTotalRecords(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error loading members:', error);
            setLoading(false);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat memuat data', life: 3000 });
        }
    };

    const openNew = () => {
        setMember(emptyMember);
        setSubmitted(false);
        setMemberDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setMemberDialog(false);
    };

    const hideDeleteMemberDialog = () => {
        setDeleteMemberDialog(false);
    };

    const hideDeleteMembersDialog = () => {
        setDeleteMembersDialog(false);
    };

    const saveMember = async () => {
        setSubmitted(true);

        if (member.name.trim() && member.email.trim() && member.phone.trim()) {
            try {
                const formData = new FormData();
                Object.keys(member).forEach(key => {
                    if (key !== 'avatar' || (key === 'avatar' && member.avatar instanceof File)) {
                        formData.append(key, member[key]);
                    }
                });

                if (member.id) {
                    await MemberApi.updateMember(member.id, formData);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data anggota berhasil diubah', life: 3000 });
                } else {
                    await MemberApi.createMember(formData);
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menambahkan anggota baru', life: 3000 });
                }
                loadLazyData();
            } catch (error) {
                console.error('Error saving member:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menyimpan data anggota', life: 3000 });
            }

            setMemberDialog(false);
            setMember(emptyMember);
        }
    };

    const editMember = (member) => {
        setMember({ ...member });
        setMemberDialog(true);
    };

    const confirmDeleteMember = (member) => {
        setMember(member);
        setDeleteMemberDialog(true);
    };

    const deleteMember = async () => {
        try {
            await MemberApi.deleteMember(member.id);
            loadLazyData();
            setDeleteMemberDialog(false);
            setMember(emptyMember);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Data anggota berhasil dihapus', life: 3000 });
        } catch (error) {
            console.error('Error deleting member:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus data anggota', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteMembersDialog(true);
    };

    const deleteSelectedMembers = async () => {
        try {
            await MemberApi.deleteMultipleMembers(selectedMembers.map(member => member.id));
            loadLazyData();
            setDeleteMembersDialog(false);
            setSelectedMembers(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Berhasil menghapus anggota terpilih', life: 3000 });
        } catch (error) {
            console.error('Error deleting multiple members:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Terjadi kesalahan saat menghapus anggota terpilih', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _member = { ...member };
        _member[`${name}`] = val;
        setMember(_member);
    };

    const onFileChange = (e) => {
        let _member = { ...member };
        _member['avatar'] = e.target.files[0];
        setMember(_member);
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
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedMembers || !selectedMembers.length} />
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
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editMember(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteMember(rowData)} />
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

    const memberDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Simpan" icon="pi pi-check" text onClick={saveMember} />
        </>
    );

    const deleteMemberDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteMemberDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteMember} />
        </>
    );

    const deleteMembersDialogFooter = (
        <>
            <Button label="Batal" icon="pi pi-times" text onClick={hideDeleteMembersDialog} />
            <Button label="Hapus" icon="pi pi-check" text onClick={deleteSelectedMembers} />
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
                        value={members}
                        selection={selectedMembers}
                        onSelectionChange={(e) => setSelectedMembers(e.value)}
                        dataKey="id"
                        paginator
                        rows={lazyParams.rows}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} members"
                        globalFilter={globalFilter}
                        emptyMessage="No members found."
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
                        <Column field="phone" header="Telepon" sortable body={(rowData) => <span>{rowData.phone}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="status" header="Status" sortable body={(rowData) => <span>{rowData.status}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={memberDialog} style={{ width: '450px' }} header="Member Details" modal className="p-fluid" footer={memberDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nama</label>
                            <InputText id="name" value={member.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !member.name })} />
                            {submitted && !member.name && <small className="p-invalid">Nama wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={member.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !member.email })} />
                            {submitted && !member.email && <small className="p-invalid">Email wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="phone">Telepon</label>
                            <InputText id="phone" value={member.phone} onChange={(e) => onInputChange(e, 'phone')} required className={classNames({ 'p-invalid': submitted && !member.phone })} />
                            {submitted && !member.phone && <small className="p-invalid">Telepon wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="address">Alamat</label>
                            <InputText id="address" value={member.address} onChange={(e) => onInputChange(e, 'address')} required className={classNames({ 'p-invalid': submitted && !member.address })} />
                            {submitted && !member.address && <small className="p-invalid">Alamat wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="city">Kota</label>
                            <InputText id="city" value={member.city} onChange={(e) => onInputChange(e, 'city')} required className={classNames({ 'p-invalid': submitted && !member.city })} />
                            {submitted && !member.city && <small className="p-invalid">Kota wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="state">Provinsi</label>
                            <InputText id="state" value={member.state} onChange={(e) => onInputChange(e, 'state')} required className={classNames({ 'p-invalid': submitted && !member.state })} />
                            {submitted && !member.state && <small className="p-invalid">Provinsi wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="postal_code">Kode Pos</label>
                            <InputText id="postal_code" value={member.postal_code} onChange={(e) => onInputChange(e, 'postal_code')} required className={classNames({ 'p-invalid': submitted && !member.postal_code })} />
                            {submitted && !member.postal_code && <small className="p-invalid">Kode Pos wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="latitude">Latitude</label>
                            <InputText id="latitude" value={member.latitude} onChange={(e) => onInputChange(e, 'latitude')} />
                        </div>
                        <div className="field">
                            <label htmlFor="longitude">Longitude</label>
                            <InputText id="longitude" value={member.longitude} onChange={(e) => onInputChange(e, 'longitude')} />
                        </div>
                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <Dropdown id="status" value={member.status} options={statusOptions} onChange={(e) => onInputChange(e, 'status')} placeholder="Select a Status" required className={classNames({ 'p-invalid': submitted && !member.status })} />
                            {submitted && !member.status && <small className="p-invalid">Status wajib diisi.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="avatar">Avatar</label>
                            <Image className="block" src={member.avatar instanceof File ? URL.createObjectURL(member.avatar) : member.avatar} alt="Avatar" width="100" height="100" preview />
                            <InputText id="avatar" type="file" onChange={(e) => onFileChange(e)} accept="image/*" />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMemberDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMemberDialogFooter} onHide={hideDeleteMemberDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {member && (
                                <span>
                                    Apakah Anda yakin ingin menghapus data <b>{member.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMembersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMembersDialogFooter} onHide={hideDeleteMembersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedMembers && <span>Apakah Anda yakin ingin menghapus data-data anggota terpilih?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default MemberCrud;
