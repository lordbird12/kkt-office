/* eslint-disable */
import { NgModule } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
// const storedPermission = JSON.parse(localStorage.getItem('permission'));
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';



var langues = localStorage.getItem('lang');
if(langues == 'tr'){
}
export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'admin',
        // title: 'จัดการระบบ',
        // subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        title: localStorage.getItem('lang') === 'tr' ? 'จัดการระบบ' : 'Manage system',
        subtitle: localStorage.getItem('lang') === 'tr' ? 'ข้อมูลเกี่ยวกับระบบ' : 'Information about system',

        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'admin.employee',
                title: localStorage.getItem('lang') === 'tr' ? 'ข้อมูลพนักงาน' : 'employee information',
                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find((e) => e.menu_id === 1);
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/admin/employee/list',
            },
            {
                id: 'admin.permission',
                title: localStorage.getItem('lang') === 'tr' ? 'สิทธิ์การใช้งาน' : 'permission',
                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find((e) => e.menu_id === 2);
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'basic',
                icon: 'heroicons_outline:key',
                link: '/admin/permission/list',
            },
            {
                id: 'admin.customer',
                // title: 'ลูกค้า',
                title: localStorage.getItem('lang') === 'tr' ? 'ลูกค้า' : 'customer',
                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find((e) => e.menu_id === 3);
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/admin/customer/list',
            },
            {
                id: 'supplier',
                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find(
                        (e) => e.menu_id === 10
                    );
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                // title: 'ซัพพลายเออร์',
                title: localStorage.getItem('lang') === 'tr' ? 'ซัพพลายเออร์' : 'suppliers',
                type: 'basic',
                icon: 'heroicons_outline:home-modern',
                link: '/admin/supplier/list',
            },
        ],
    },
    {
        id: 'products',
        // title: 'จัดการคลังและสินค้า',
        // subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        title: localStorage.getItem('lang') === 'tr' ? 'จัดการคลังและสินค้า' : 'manage inventory and products',
        subtitle: localStorage.getItem('lang') === 'tr' ? 'ข้อมูลเกี่ยวกับระบบ' : 'Information about system',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'products.warehouse',
                // title: 'คลังสินค้า',
                title: localStorage.getItem('lang') === 'tr' ? 'คลังสินค้า' : 'warehouse',

                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find((e) => e.menu_id === 4);
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'basic',
                icon: 'heroicons_outline:home-modern',
                link: '/admin/warehouse/list',
            },
            {
                id: 'products.category',
                // title: 'ประเภทสินค้า',
                title: localStorage.getItem('lang') === 'tr' ? 'ประเภทสินค้า' : 'Product type',
                type: 'basic',
                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find((e) => e.menu_id === 5);
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                icon: 'heroicons_outline:cube',
                link: '/admin/category/list',
            },
            {
                id: 'products.product',
                // title: 'สินค้า',
                title: localStorage.getItem('lang') === 'tr' ? 'สินค้า' : 'product',
                type: 'basic',
                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find((e) => e.menu_id === 5);
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                icon: 'heroicons_outline:cube',
                link: '/admin/product/list',
            },
            {
                id: 'products.raw',
                // title: 'อะไหล่',
                title: localStorage.getItem('lang') === 'tr' ? 'อะไหล่' : 'raw material',
                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find((e) => e.menu_id === 6);
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'basic',
                icon: 'heroicons_outline:cube',
                link: '/admin/raw/list',
            },
         
            {
                id: 'products.unit',
                // title: 'หน่วยนับ',
                title: localStorage.getItem('lang') === 'tr' ? 'หน่วยนับ' : 'Counting unit',
                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find(
                        (e) => e.menu_id === 13
                    );
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'basic',
                icon: 'heroicons_outline:archive-box',
                link: '/admin/unit/list',
            },
            {
                id: 'products.stocktrans',
                // title: 'รับเข้า-เบิกออก',
                title: localStorage.getItem('lang') === 'tr' ? 'รับเข้า-เบิกออก' : 'Receive-withdraw',
                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find(
                        (e) => e.menu_id === 11
                    );
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/in-out/list',
            },
            {
                id: 'products.report-stocktrans',
                // title: 'รับเข้า-เบิกออก',
                title: localStorage.getItem('lang') === 'tr' ? 'รายงานรับเข้า-เบิกออก' : 'Report Stock',
                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find(
                        (e) => e.menu_id === 11
                    );
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/admin/report/list',
            },
        ],
    },
    {
        id: 'sales',
        // title: 'จัดการคำสั่งซื้อ',
        // subtitle: 'ขัอมูลเกี่ยวกับระบบ',
        title: localStorage.getItem('lang') === 'tr' ? 'จัดการคำสั่งซื้อ' : 'Manage orders',
        subtitle: localStorage.getItem('lang') === 'tr' ? 'ข้อมูลเกี่ยวกับระบบ' : 'Information about system',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'sales.list',
                // title: 'รายการคำสั่งซื้อ',
                title: localStorage.getItem('lang') === 'tr' ? 'รายการคำสั่งซื้อ' : 'Order list',

                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find((e) => e.menu_id === 7);
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'basic',
                icon: 'heroicons_outline:home-modern',
                link: '/admin/sales/list',
            },
        ],
    },
    {
        id: 'factories',
        // title: 'จัดการโรงงานผลิตสินค้า',
        // subtitle: 'โรงงานผลิตสินค้า',
        title: localStorage.getItem('lang') === 'tr' ? 'จัดการโรงงานผลิตสินค้า' : 'Manage product plants',
        subtitle: localStorage.getItem('lang') === 'tr' ? 'โรงงานผลิตสินค้า' : 'Product factory',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'factories.list',
                // title: 'รายการผลิต',
                title: localStorage.getItem('lang') === 'tr' ? 'รายการผลิต' : 'Production list',

                hidden: () => {
                    const storedPermission = JSON.parse(
                        localStorage.getItem('permission')
                    );
                    const menu = storedPermission?.find((e) => e.menu_id === 8);
                    if (menu?.view === 0) {
                        return true;
                    } else {
                        return false;
                    }
                },
                type: 'basic',
                icon: 'heroicons_outline:home-modern',
                link: '/admin/factories/list',
            },
        ],
    },
    // {
    //     id: 'supplier',
    //     title: 'ซัพพลายเออร์',
    //     subtitle: 'ขัอมูลซัพพลายเออร์',
    //     type: 'group',
    //     icon: 'heroicons_outline:home',
    //     children: [

    //     ],
    // },
    // {
    //     id: 'apps',
    //     title: 'จัดการโปรแกรมระบบ',
    //     subtitle: 'ขัอมูลเกี่ยวกับระบบ',
    //     type: 'group',
    //     icon: 'heroicons_outline:home',
    //     children: [
    //         {
    //             id: 'apps.file-manager',
    //             title: 'ไฟล์เอกสาร',
    //             type: 'basic',
    //             icon: 'heroicons_outline:cloud',
    //             link: '/apps/file-manager',
    //         },
    //         {
    //             id: 'apps.help-center',
    //             title: 'ศูนย์ช่วยเหลือ',
    //             type: 'collapsable',
    //             icon: 'heroicons_outline:information-circle',
    //             link: '/apps/help-center',
    //             children: [
    //                 {
    //                     id: 'apps.help-center.home',
    //                     title: 'Home',
    //                     type: 'basic',
    //                     link: '/apps/help-center',
    //                     exactMatch: true,
    //                 },
    //                 {
    //                     id: 'apps.help-center.faqs',
    //                     title: 'FAQs',
    //                     type: 'basic',
    //                     link: '/apps/help-center/faqs',
    //                 },
    //                 {
    //                     id: 'apps.help-center.guides',
    //                     title: 'Guides',
    //                     type: 'basic',
    //                     link: '/apps/help-center/guides',
    //                 },
    //                 {
    //                     id: 'apps.help-center.support',
    //                     title: 'Support',
    //                     type: 'basic',
    //                     link: '/apps/help-center/support',
    //                 },
    //             ],
    //         },
    //         {
    //             id: 'apps.mailbox',
    //             title: 'กล่องจดหมาย',
    //             type: 'basic',
    //             icon: 'heroicons_outline:envelope',
    //             link: '/apps/mailbox',
    //             badge: {
    //                 title: '27',
    //                 classes: 'px-2 bg-pink-600 text-white rounded-full',
    //             },
    //         },
    //     ],
    // },
    {
        id: 'self',
        title: localStorage.getItem('lang') === 'tr' ? 'ส่วนตัว' : 'personal',
        subtitle: localStorage.getItem('lang') === 'tr' ? 'จัดการโปรไฟล์' : 'Manage profile',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            // {
            //     id: 'self.employee',
            //     // title: 'แก้ไขข้อมูลส่วนตัว',
            //     title: localStorage.getItem('lang') === 'tr' ? 'แก้ไขข้อมูลส่วนตัว' : 'Edit personal information',

            //     hidden: () => {
            //         const storedPermission = JSON.parse(
            //             localStorage.getItem('permission')
            //         );
            //         const menu = storedPermission?.find((e) => e.menu_id === 9);
            //         if (menu?.view === 0) {
            //             return true;
            //         } else {
            //             return false;
            //         }
            //     },
            //     type: 'basic',
            //     icon: 'heroicons_outline:user',
            //     link: '/admin/employee/list',
            // },
            {
                id: 'admin.logout',
                // title: 'ออกจากระบบ',
                title: localStorage.getItem('lang') === 'tr' ? 'ออกจากระบบ' : 'Log out',

                type: 'basic',
                icon: 'heroicons_outline:arrow-left-on-rectangle',
                link: '/sign-out',
            },
        ],
    },
];

export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'aside',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        tooltip: 'Apps',
        type: 'aside',
        icon: 'heroicons_outline:qr-code',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        tooltip: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        tooltip: 'UI',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation',
        tooltip: 'Navigation',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation Features',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'แดชบอร์ด',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    // {
    //     id: 'apps',
    //     title: 'Apps',
    //     type: 'group',
    //     icon: 'heroicons_outline:qr-code',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'pages',
    //     title: 'Pages',
    //     type: 'group',
    //     icon: 'heroicons_outline:document-duplicate',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'user-interface',
    //     title: 'UI',
    //     type: 'group',
    //     icon: 'heroicons_outline:rectangle-stack',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'navigation-features',
    //     title: 'Misc',
    //     type: 'group',
    //     icon: 'heroicons_outline:bars-3',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    {
        id: 'purchase',
        title: 'ซื้อ',
        type: 'group',
        icon: 'heroicons_outline:inbox-arrow-down',
        children: [],
    },
    {
        id: 'sale',
        title: 'ขาย',
        type: 'group',
        icon: 'heroicons_outline:shopping-cart',
        children: [],
    },
    {
        id: 'category',
        title: 'ประเภทสินค้า',
        type: 'group',
        icon: 'heroicons_outline:cube',
        children: [],
    },
    {
        id: 'inventory',
        title: 'คลังสินค้า',
        type: 'group',
        icon: 'heroicons_outline:cube',
        children: [],
    },
    {
        id: 'accounting',
        title: 'บัญชี/การเงิน',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'delivery-workers',
        title: 'คนส่งของ',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'admin',
        title: 'จัดการพนักงาน',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'reports',
        title: 'รายงาน',
        type: 'group',
        icon: 'heroicons_outline:clipboard-document-list',
        children: [],
    },

];

