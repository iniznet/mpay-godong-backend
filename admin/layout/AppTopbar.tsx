/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import AuthApi from '@/services/AuthApi';
import { useRouter } from 'next/navigation';
import { setCookie } from 'typescript-cookie';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const overlayPanelRef = useRef(null);
    const router = useRouter();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    async function handleLogout() {
        await AuthApi.logout();
        localStorage.removeItem('token');
        setCookie('token', '', { expires: -1 });
        router.push('/auth/login');
    }

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo.png`} width="47.22px" height={'35px'} alt="logo" />
                <span>MPay Godong</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <div className="profile-menu">
                    <button type="button" className="p-link layout-topbar-button" onClick={(e) => overlayPanelRef.current.toggle(e)}
                    >
                        <i className="pi pi-user"></i>
                        <span>Profile</span>
                    </button>

                    <OverlayPanel ref={overlayPanelRef}>
                        <div className="p-d-flex p-flex-column">
                            <Button
                                label="Logout"
                                className="p-button-text bg-transparent text-red-600 py-2"
                                icon="pi pi-sign-out"
                                onClick={handleLogout}
                            />
                        </div>
                    </OverlayPanel>
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
