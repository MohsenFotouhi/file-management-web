import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(private readonly layoutService: VexLayoutService) {
    this.loadNavigation();
  }

  loadNavigation(): void {
    this._items.next([
      {
        type: 'subheading',
        label: 'داشبورد',
        children: [
          {
            type: 'link',
            label: 'مدیریت فایل',
            route: '/',
            icon: 'mat:insights',
            routerLinkActiveOptions: { exact: true }
          },
          {
            type: 'link',
            label: 'پروفایل',
            route: '/dashboard',
            icon: 'mat:dashboard',
            routerLinkActiveOptions: { exact: true }
          }
        ]
      },
    ]);
  }
}
