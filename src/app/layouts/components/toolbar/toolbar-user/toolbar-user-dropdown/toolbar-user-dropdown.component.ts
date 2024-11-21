import { NgClass, NgFor, NgIf } from '@angular/common';
import
{
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { VexPopoverRef } from '@vex/components/vex-popover/vex-popover-ref';
import { trackById } from '@vex/utils/track-by';
import { AuthService } from "../../../../../pages/auth/auth.service";
import { MenuItem } from '../interfaces/menu-item.interface';

export interface OnlineStatus
{
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    NgFor,
    MatRippleModule,
    RouterLink,
    NgClass,
    NgIf
  ]
})
export class ToolbarUserDropdownComponent implements OnInit
{
  router = inject(Router);
  items: MenuItem[] = [
    {
      id: '1',
      icon: 'mat:account_circle',
      label: 'پروفایل',
      description: '',
      colorClass: 'text-teal-600',
      route: '/dashboard'
    },
    // {
    //   id: '4',
    //   icon: 'mat:table_chart',
    //   label: 'گزارشات',
    //   description: '',
    //   colorClass: 'text-purple-600',
    //   route: '/dashboard'
    // }
  ];

  statuses: OnlineStatus[] = [
    {
      id: 'online',
      label: 'Online',
      icon: 'mat:check_circle',
      colorClass: 'text-green-600'
    },
    {
      id: 'away',
      label: 'Away',
      icon: 'mat:access_time',
      colorClass: 'text-orange-600'
    },
    {
      id: 'dnd',
      label: 'Do not disturb',
      icon: 'mat:do_not_disturb',
      colorClass: 'text-red-600'
    },
    {
      id: 'offline',
      label: 'Offline',
      icon: 'mat:offline_bolt',
      colorClass: 'text-gray-600'
    }
  ];

  activeStatus: OnlineStatus = this.statuses[0];

  trackById = trackById;
  username: string = '';


  constructor(
    private cd: ChangeDetectorRef,
    private popoverRef: VexPopoverRef<ToolbarUserDropdownComponent>,
    private authService: AuthService
  )
  {
    this.authService.user$.subscribe(user =>
    {
      if (user) this.username = user.firstName + ' ' + user.lastName;
    });
  }

  ngOnInit()
  {
    this.username = localStorage.getItem('username') ?? '';
  }

  setStatus(status: OnlineStatus)
  {
    this.activeStatus = status;
    this.cd.markForCheck();
  }

  close()
  {
    this.popoverRef.close();
  }

  logout()
  {
    this.close();
    this.authService.logout();
  }
}
