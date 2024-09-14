import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FileManagerComponent } from './file-manager.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {PathComponent} from "./components/path/path.component";
import {FileContextMenuComponent} from "./components/file-context-menu/file-context-menu.component";

const routes: Routes= [
  {path: '', component: FileManagerComponent}
]

@NgModule({
  declarations: [FileManagerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatIconModule,
    PathComponent,
    FileContextMenuComponent
  ]
})
export class FileManagerModule { }
