import { Component } from '@angular/core';
import {TableColumn} from "@vex/interfaces/table-column.interface";
import {DateTime} from "luxon";

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  tableColumns: TableColumn<any>[] = [
    // {
    //   label: '',
    //   property: 'status',
    //   type: 'badge'
    // },
    {
      label: 'نام فایل',
      property: 'name',
      type: 'text'
    },
    {
      label: 'تاریخ اشتراک گذاری',
      property: 'shareDate',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'تاریخ انقضا',
      property: 'expireDate',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'عمومی',
      property: 'isPublic',
      type: 'checkbox',
      cssClasses: ['text-secondary']
    }
  ];
  tableData = [
    {
      name: 'فایل شماره یک',
      shareDate: DateTime.local().minus({ minutes: 2 }).toISODate(),
      expireDate: DateTime.local().minus({ minutes: 2 }).toISODate(),
      isPublic : 'true'
    },
    {
      name: 'فایل شماره یک',
      shareDate: DateTime.local().minus({ minutes: 6 }).toISODate(),
      expireDate: DateTime.local().minus({ minutes: 6 }).toISODate(),
      isPublic : 'false'
    },
    {
      name: 'فایل شماره یک',
      shareDate: DateTime.local().minus({ minutes: 14 }).toISODate(),
      expireDate: DateTime.local().minus({ minutes: 14 }).toISODate(),
      isPublic : 'false'
    },
    {
      name: 'فایل شماره دو',
      shareDate: DateTime.local().minus({ minutes: 17 }).toISODate(),
      expireDate: DateTime.local().minus({ minutes: 17 }).toISODate(),
      isPublic : 'false'
    },
    {
      name: 'فایل شماره سه',
      shareDate: DateTime.local().minus({ minutes: 25 }).toISODate(),
      expireDate: DateTime.local().minus({ minutes: 25 }).toISODate(),
      isPublic : 'true'
      // timestamp: 
    },
    {
      name: 'فایل شماره چهار',
      shareDate: DateTime.local().minus({ minutes: 42 }).toISODate(),
      expireDate: DateTime.local().minus({ minutes: 42 }).toISODate(),
      isPublic : 'false'
      // timestamp: 
    },
    {
      name: 'فایل شماره پنج',
      shareDate: DateTime.local().minus({ minutes: 87 }).toISODate(),
      expireDate: DateTime.local().minus({ minutes: 87 }).toISODate(),
      isPublic : 'true'
      // timestamp: 
    },
    {
      name: 'فایل شماره شش',
      shareDate: DateTime.local().minus({ minutes: 102 }).toISODate(),
      expireDate: DateTime.local().minus({ minutes: 102 }).toISODate(),
      isPublic : 'true'
    },
    
  ];

}
