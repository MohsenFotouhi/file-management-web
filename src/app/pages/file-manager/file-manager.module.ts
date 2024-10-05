import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule, Routes } from '@angular/router';
import { CanvasSquareComponent } from '../../components/canvas-square/canvas-square.component';
import { FileContextMenuComponent } from "./components/file-context-menu/file-context-menu.component";
import { PathComponent } from "./components/path/path.component";
import { SharedFilesComponent } from './components/shared-files/shared-files.component';
import { FileManagerComponent } from './file-manager.component';

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
  ]
})
export class FileManagerModule { }
