import { Component, Input, ViewChild, OnChanges, ElementRef, AfterViewInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'vex-sidenav-storage',
  standalone: true,
  imports: [],
  templateUrl: './sidenav-storage.component.html',
  styleUrl: './sidenav-storage.component.scss'
})
export class SidenavStorageComponent implements OnChanges, AfterViewInit {

  @Input() storageUsage!: number;
  @ViewChild('progressbar', { static: false }) progressbar!: ElementRef;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['storageUsage'].firstChange) {
      this.updateStorageUsage();
    }
  }

  ngAfterViewInit(): void {
    this.updateStorageUsage();
  }

  updateStorageUsage(): void {
    if (this.storageUsage) {
      this.progressbar.nativeElement['aria-valuenow'] = this.storageUsage;
      this.progressbar.nativeElement.style = `--value: ${this.storageUsage}`;
    }
  }
}
