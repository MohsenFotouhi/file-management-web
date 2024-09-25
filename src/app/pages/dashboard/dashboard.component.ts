import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TableColumn } from "@vex/interfaces/table-column.interface";
import { DateTime } from "luxon";
import { SharedFile } from 'src/app/interface/shared-file';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {


  tableData: any[] = [];

  constructor(private service: DashboardService) {
  
  }


  ngOnInit(): void {

    this.service.getSharedByUser().subscribe(x =>{
      this.tableData = x;
      console.log(x);
      console.log(this.tableData);
    }
    );
  }


  tableColumns: TableColumn<SharedFile>[] = [
    // {
    //   label: '',
    //   property: 'status',
    //   type: 'badge'
    // },
    {
      label: 'نام فایل',
      property: 'FileName',
      type: 'text'
    },
    {
      label: 'تاریخ اشتراک گذاری',
      property: 'CreateDate',
      type: 'text',
      cssClasses: ['font-medium']
    },
    {
      label: 'تاریخ انقضا',
      property: 'ExpireDate',
      type: 'text',
      cssClasses: ['text-secondary']
    },
    {
      label: 'عمومی',
      property: 'IsPublic',
      type: 'checkbox',
      cssClasses: ['text-secondary']
    },
    {
      label: 'دائمی',
      property: 'IsPermanent',
      type: 'checkbox',
      cssClasses: ['text-secondary']
    },
    {
      label: 'جزئیات',
      property: 'details',
      type: 'expandable',
      cssClasses: ['text-secondary']
    }
  ];
  // tableData: SharedFile[];
  //   {
  //     name: 'فایل شماره یک',
  //     shareDate: DateTime.local().minus({ minutes: 2 }).toISODate(),
  //     expireDate: DateTime.local().minus({ minutes: 2 }).toISODate(),
  //     isPublic : true,
  //     details: '...',
  //     sharedBy: ['کاربر1']
  //   },
  //   {
  //     name: 'فایل شماره یک',
  //     shareDate: DateTime.local().minus({ minutes: 6 }).toISODate(),
  //     expireDate: DateTime.local().minus({ minutes: 6 }).toISODate(),
  //     isPublic : false,
  //     details: '...',
  //     sharedBy: ['کاربر1']
  //   },
  //   {
  //     name: 'فایل شماره یک',
  //     shareDate: DateTime.local().minus({ minutes: 14 }).toISODate(),
  //     expireDate: DateTime.local().minus({ minutes: 14 }).toISODate(),
  //     isPublic : false,
  //     details: '...',
  //     sharedBy: ['کاربر1']
  //   },
  //   {
  //     name: 'فایل شماره دو',
  //     shareDate: DateTime.local().minus({ minutes: 17 }).toISODate(),
  //     expireDate: DateTime.local().minus({ minutes: 17 }).toISODate(),
  //     isPublic : false,
  //     details: '...',
  //     sharedBy: ['کاربر1']
  //   },
  //   {
  //     name: 'فایل شماره سه',
  //     shareDate: DateTime.local().minus({ minutes: 25 }).toISODate(),
  //     expireDate: DateTime.local().minus({ minutes: 25 }).toISODate(),
  //     isPublic : true,
  //     details: '...',
  //     sharedBy: ['کاربر1']
  //   },
  //   {
  //     name: 'فایل شماره چهار',
  //     shareDate: DateTime.local().minus({ minutes: 42 }).toISODate(),
  //     expireDate: DateTime.local().minus({ minutes: 42 }).toISODate(),
  //     isPublic : false,
  //     details: '...',
  //     sharedBy: ['کاربر1']
  //     // timestamp: 
  //   },
  //   {
  //     name: 'فایل شماره پنج',
  //     shareDate: DateTime.local().minus({ minutes: 87 }).toISODate(),
  //     expireDate: DateTime.local().minus({ minutes: 87 }).toISODate(),
  //     isPublic : true,
  //     details: '...',
  //     sharedBy: ['کاربر1']
  //   },
  //   {
  //     name: 'فایل شماره شش',
  //     shareDate: DateTime.local().minus({ minutes: 102 }).toISODate(),
  //     expireDate: DateTime.local().minus({ minutes: 102 }).toISODate(),
  //     isPublic : true,
  //     details: '...',
  //     sharedBy: ['کاربر1']
  //   },

  // ];

}
