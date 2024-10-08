import {Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import {MatPaginator } from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {TableColumn} from "@vex/interfaces/table-column.interface";
import {MatSort} from "@angular/material/sort";
import { ShareDetailComponent } from './share-detail/share-detail.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'vex-share-files',
  templateUrl: './share-files.component.html',
  styleUrl: './share-files.component.scss'
})
export class ShareFilesComponent {
  @Input({ required: true }) data!: any[];
  @Input({ required: true }) columns!: TableColumn<any>[];
  @Input() pageSize = 6;

  visibleColumns!: Array<keyof any | string>;
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      console.log(this.columns)
      this.visibleColumns = this.columns.map((column) => column.property);
    }

    if (changes['data']) {
      this.dataSource.data = this.data;
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }


  openDetailModal(row : any) {
    const dialogRef = this.dialog.open(ShareDetailComponent, {
      data: row.sharedBy,
      width: '500px'
    });

    return dialogRef.afterClosed().toPromise();
  }


}
