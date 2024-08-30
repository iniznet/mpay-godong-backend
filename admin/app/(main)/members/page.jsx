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

const MemberCrud = () => {
    let emptyMember = {
        id: null,
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        latitude: '',
        longitude: '',
        avatar: '',
        status: '',
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


