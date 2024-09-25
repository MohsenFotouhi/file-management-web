import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgxSpinnerModule} from "ngx-spinner";

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule]
})
export class AppComponent {
}
