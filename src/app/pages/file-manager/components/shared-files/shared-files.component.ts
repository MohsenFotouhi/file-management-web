import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFile } from 'src/app/interface/shared-file';
import { FileManagerService } from 'src/app/services/file-manager.service';

@Component({
  selector: 'app-shared-files',
  standalone: true,
  imports: [NgFor],
  templateUrl: './shared-files.component.html',
  styleUrl: './shared-files.component.scss'
})
export class SharedFilesComponent {

  constructor(service: FileManagerService ) {
  }

}
