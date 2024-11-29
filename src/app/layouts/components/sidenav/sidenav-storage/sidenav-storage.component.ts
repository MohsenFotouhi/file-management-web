import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'vex-sidenav-storage',
  standalone: true,
  imports: [],
  templateUrl: './sidenav-storage.component.html',
  styleUrl: './sidenav-storage.component.scss'
})
export class SidenavStorageComponent implements AfterViewInit {
  @Input() storageUsage!: number;
  @ViewChild('progressbar', { static: false }) progressbar!: ElementRef;

  ngAfterViewInit() {
    this.progressbar.nativeElement['aria-valuenow'] = this.storageUsage;
    this.progressbar.nativeElement.style = `--value: ${this.storageUsage}`;
  }
}
