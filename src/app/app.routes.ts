import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
    // Redirect empty path to '/dashboards/project'
    { path: '', pathMatch: 'full', redirectTo: 'dashboards/project' },

    // Redirect signed-in user to the '/dashboards/project'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {
        path: 'signed-in-redirect',
        pathMatch: 'full',
        redirectTo: 'dashboards/project',
    },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'confirmation-required',
                loadChildren: () =>
                    import(
                        'app/modules/auth/confirmation-required/confirmation-required.routes'
                    ),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/forgot-password/forgot-password.routes'
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import(
                        'app/modules/auth/reset-password/reset-password.routes'
                    ),
            },
            {
                path: 'sign-in',
                loadChildren: () =>
                    import('app/modules/auth/sign-in/sign-in.routes'),
            },
            {
                path: 'sign-up',
                loadChildren: () =>
                    import('app/modules/auth/sign-up/sign-up.routes'),
            },
        ],
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'sign-out',
                loadChildren: () =>
                    import('app/modules/auth/sign-out/sign-out.routes'),
            },
            {
                path: 'unlock-session',
                loadChildren: () =>
                    import(
                        'app/modules/auth/unlock-session/unlock-session.routes'
                    ),
            },
        ],
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
        },
        children: [
            {
                path: 'home',
                loadChildren: () =>
                    import('app/modules/landing/home/home.routes'),
            },
        ],
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver,
        },
        children: [
            // Dashboards
            {
                path: 'dashboards',
                children: [
                    {
                        path: 'project',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/project/project.routes'
                            ),
                    },
                    {
                        path: 'analytics',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/analytics/analytics.routes'
                            ),
                    },
                    {
                        path: 'finance',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/finance/finance.routes'
                            ),
                    },
                    {
                        path: 'crypto',
                        loadChildren: () =>
                            import(
                                'app/modules/admin/dashboards/crypto/crypto.routes'
                            ),
                    },
                ],
            },

            // 404 & Catch all
            // { path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.routes') },
            { path: '**', redirectTo: '404-not-found' },
            //Sales
            {
                path: 'admin',
                children: [
                    {
                        path: 'position',
                        loadChildren: () =>
                            import('app/modules/admin/position/page.routes'),
                    },
                    {
                        path: 'employee',
                        loadChildren: () =>
                            import('app/modules/admin/employee/page.routes'),
                    },
                    {
                        path: 'permission',
                        children: [
                            {
                                path: '',
                                loadChildren: () =>
                                    import(
                                        'app/modules/admin/permission/permission.module'
                                    ).then((m) => m.PermissionModule),
                            },
                        ],
                    },
                    {
                        path: 'supplier',
                        children: [
                            {
                                path: '',
                                loadChildren: () =>
                                    import(
                                        'app/modules/admin/supplier/supplier.module'
                                    ).then((m) => m.SupplierModule),
                            },
                        ],
                    },
                    {
                        path: 'product',
                        loadChildren: () =>
                            import('app/modules/admin/product/page.routes'),
                    },
                    {
                        path: 'unit',
                        loadChildren: () =>
                            import('app/modules/admin/unit/page.routes'),
                    },
                    {
                        path: 'customer',
                        loadChildren: () =>
                            import('app/modules/admin/customer/page.routes'),
                    },
                    {
                        path: 'shelf',
                        loadChildren: () =>
                            import('app/modules/admin/shelf/page.routes'),
                    },
                    {
                        path: 'warehouse',
                        loadChildren: () =>
                            import('app/modules/admin/warehouse/page.routes'),
                    },
                    {
                        path: 'raw',
                        loadChildren: () =>
                            import('app/modules/admin/raw/page.routes'),
                    },
                    {
                        path: 'banjupan',
                        loadChildren: () =>
                            import('app/modules/admin/banjupan/page.routes'),
                    },
                    {
                        path: 'factories',
                        loadChildren: () =>
                            import('app/modules/admin/factories/page.routes'),
                    },
                    {
                        path: 'sales',
                        loadChildren: () =>
                            import('app/modules/admin/sales/page.routes'),
                    },
                    {
                        path: 'in-out',
                        loadChildren: () =>
                            import('app/modules/admin/in-out/page.routes'),
                    },

                    {
                        path: 'stock',
                        loadChildren: () =>
                            import('app/modules/admin/stock/page.routes'),
                    },

                    {
                        path: 'category',
                        loadChildren: () =>
                            import('app/modules/admin/category/page.routes'),
                    },
                    {
                        path: 'report',
                        loadChildren: () =>
                            import('app/modules/admin/report/page.routes'),
                    },
                    {
                        path: 'promotion',
                        loadChildren: () =>
                            import('app/modules/admin/promotion/page.routes'),
                    },
                    {
                        path: 'bank',
                        loadChildren: () =>
                            import('app/modules/admin/bank/page.routes'),
                    },
                    {
                        path: 'transport',
                        loadChildren: () =>
                            import('app/modules/admin/transport/page.routes'),
                    },
                    {
                        path: 'report-stock',
                        loadChildren: () =>
                            import('app/modules/admin/report-stock/page.routes'),
                    },
                ],
            },
        ],
    },
];
