import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule, Routes } from '@angular/router';
import { SummerizePipe } from 'src/app/pipes/summerize.pipe';
import { CanvasSquareComponent } from '../../components/canvas-square/canvas-square.component';
import { FileContextMenuComponent } from "./components/file-context-menu/file-context-menu.component";
import { PathComponent } from "./components/path/path.component";
import { SharedFilesComponent } from './components/shared-files/shared-files.component';
import { FileManagerComponent } from './file-manager.component';
import { MatInputModule } from '@angular/material/input';

const routes: Routes = [
  { path: '', component: FileManagerComponent }
];

@NgModule({
  declarations: [FileManagerComponent, CanvasSquareComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatIconModule,
    PathComponent,
    FileContextMenuComponent,
    MatProgressSpinnerModule,
    SharedFilesComponent,
    SummerizePipe,
    MatTabsModule,
    MatInputModule
  ]
})
export class FileManagerModule { }
