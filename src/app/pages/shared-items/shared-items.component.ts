import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ShareFilesComponent } from '../dashboard/share-files/share-files.component';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { SharedFile } from 'src/app/interface/shared-file';

@Component({
  selector: 'vex-shared-items',
  standalone: true,
  imports: [CommonModule, ShareFilesComponent],
  templateUrl: './shared-items.component.html',
  styleUrl: './shared-items.component.scss'
})
export class SharedItemsComponent implements OnInit
{
  constructor(private service: DashboardService)
  { }

  tableData: any[] = [];
  ngOnInit(): void
  {

    this.service.getSharedByUser().subscribe(x =>
    {
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
      property: 'fileName',
      type: 'text'
    },
    {
      label: 'تاریخ اشتراک گذاری',
      property: 'createDate',
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
    },
    {
      label: 'دائمی',
      property: 'isPermanent',
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

}
