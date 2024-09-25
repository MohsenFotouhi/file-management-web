import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {UserStorageComponent} from "./user-storage/user-storage.component";
import {ShareFilesComponent} from "./share-files/share-files.component";
import {VexChartComponent} from "@vex/components/vex-chart/vex-chart.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSortModule} from "@angular/material/sort";
import { ShareDetailComponent } from './share-files/share-detail/share-detail.component';

const routes: Routes = [
  {path: '', component: DashboardComponent}
]

@NgModule({
  declarations: [
    DashboardComponent,
    UserStorageComponent,
    ShareFilesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    VexChartComponent,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    ShareDetailComponent
    
  ]
})
export class DashboardModule {
}
