import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { authGuard } from './gaurds/auth.guard';
import { LayoutComponent } from './layouts/layout/layout.component';
import { FileManagerComponent } from './pages/file-manager/file-manager.component';
import { OTPComponent } from './pages/OTPs/otp/otp.component';
import { VerifyOtpComponentComponent } from './pages/OTPs/verify-otp-component/verify-otp-component.component';
import { SharedItemsComponent } from './pages/shared-items/shared-items.component';

export const appRoutes: VexRoutes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'download',
    loadComponent: () =>
      import('./pages/link-download/link-download.component').then(
        (m) => m.LinkDownloadComponent
      )
  },
  {
    path: 'error-404',
    loadComponent: () =>
      import('./pages/errors/error-404/error-404.component').then(
        (m) => m.Error404Component
      )
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/file-manager/file-manager.module').then(
            (m) => m.FileManagerModule
          )
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          )
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component').then(
            (m) => m.SettingsComponent
          )
      },

      // {
      //   path: 'setting', component: SettingComponent
      // },
      {
        path: 'setting',
        component: OTPComponent
      },

      { path: 'verify-otp', component: VerifyOtpComponentComponent },
      {
        path: 'fileManagement/showShareFiles',
        component: FileManagerComponent
      },
      { path: 'shared-items', component: SharedItemsComponent }
      //{ path: '**', component: PageNotFoundComponent },
    ]
  }
];
