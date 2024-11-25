import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import { authGuard } from "./gaurds/auth.guard";
import { LayoutComponent } from './layouts/layout/layout.component';
import { FileManagerComponent } from './pages/file-manager/file-manager.component';
import { OTPComponent } from './pages/OTPs/otp/otp.component';
import { VerifyOtpComponentComponent } from './pages/OTPs/verify-otp-component/verify-otp-component.component';
import { SharedItemsComponent } from './pages/shared-items/shared-items.component';
import { SharedWithUserComponent } from './pages/shared-with-user/shared-with-user.component';

export const appRoutes: VexRoutes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      )
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/file-manager/file-manager.module').then(m => m.FileManagerModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      // {
      //   path: 'setting', component: SettingComponent
      // },
      {
        path: 'setting', component: OTPComponent
      },
      {
        'path': 'download',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/link-download/link-download.component').then((m) => m.LinkDownloadComponent),
          },
        ]
      },

      { path: 'verify-otp', component: VerifyOtpComponentComponent },
      { path: 'fileManagement/showShareFiles', component: FileManagerComponent },
      { path: 'shared-with-me', component: SharedWithUserComponent },
      { path: 'shared-items', component: SharedItemsComponent }
      //{ path: '**', component: PageNotFoundComponent },
    ]
  }
];
