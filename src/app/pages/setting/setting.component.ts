import { Component } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'vex-setting',
  standalone: true,
  imports: [QRCodeModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {
  public stringQrCode: string;

  constructor() {
    this.stringQrCode = 'eduforbetterment.com';
  }
}
