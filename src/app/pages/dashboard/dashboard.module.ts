import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { VexChartComponent } from "@vex/components/vex-chart/vex-chart.component";
import { DashboardComponent } from "./dashboard.component";
import { ShareDetailComponent } from './share-files/share-detail/share-detail.component';
import { ShareFilesComponent } from "./share-files/share-files.component";
import { UserStorageComponent } from "./user-storage/user-storage.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [
    DashboardComponent,
    UserStorageComponent,
  ],
  imports: [
    ShareFilesComponent,
    CommonModule,
    RouterModule.forChild(routes),
    VexChartComponent,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    ShareDetailComponent,
    MatProgressBarModule
  ]
})
export class DashboardModule
{
}
