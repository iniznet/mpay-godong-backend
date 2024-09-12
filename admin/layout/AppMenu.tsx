import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';
import { useUser } from '@/context/userContext';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { user } = useUser();

    const model: AppMenuItem[] = [
        {
            label: 'Beranda',
            items: [{ label: 'Dasbor', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Transaksi',
            items: [
                { label: 'Mutasi', icon: 'pi pi-fw pi-download', to: '/mutasi' },
                { label: 'Angsuran', icon: 'pi pi-fw pi-refresh', to: '/angsuran' },
            ]
        },
        ...(user && user.role !== 'collector' ? [
            {
                label: 'Data',
                items: [
                    { label: 'Tabungan', icon: 'pi pi-fw pi-inbox', to: '/tabungan' },
                    { label: 'Debitur', icon: 'pi pi-fw pi-users', to: '/debitur' },
                    { label: 'Nasabah', icon: 'pi pi-fw pi-users', to: '/members' },
                    { label: 'Karyawan', icon: 'pi pi-fw pi-users', to: '/users' },
                ]
            },
        ] : [])
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;