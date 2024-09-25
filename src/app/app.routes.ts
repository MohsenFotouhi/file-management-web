import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';
import {authGuard} from "./gaurds/auth.guard";
import { SettingComponent } from './pages/setting/setting.component';
import { FileManagerComponent } from './pages/file-manager/file-manager.component';
import { OTPComponent } from './pages/OTPs/otp/otp.component';
import { VerifyOtpComponentComponent } from './pages/OTPs/verify-otp-component/verify-otp-component.component';

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
      { path: 'verify-otp', component: VerifyOtpComponentComponent },
      {path: 'fileManagement/showShareFiles', component:FileManagerComponent}
      //{ path: '**', component: PageNotFoundComponent },
    ]
  },

];
