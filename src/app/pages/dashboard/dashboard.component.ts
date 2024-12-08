import { Component, OnInit } from '@angular/core';
import { FileDownloadService } from '../../services/file-download.service';

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  progress = 0;
  isDownloadWithIDM = true;

  constructor(private fileDownloadService: FileDownloadService) {
    this.fileDownloadService.progress$.subscribe((value) => {
      this.progress = value;
    });
    this.fileDownloadService.isDownloadWithIDM$.subscribe((value) => {
      this.isDownloadWithIDM = value;
    });
  }

  ngOnInit(): void {
  }

  downloadedFileSize = 0;
  totalSize = 2102720520;

  getProgressValue(): number {
    return Math.ceil((this.downloadedFileSize / this.totalSize) * 100);
  }

  async downloadFile() {
    const fileUrl = 'http://rfms.roka-co.com:443/api/file/download-with-range';
    const totalSize = 2102720520 - 1;
    await this.fileDownloadService.downloadFile(fileUrl, totalSize);
  }

}
