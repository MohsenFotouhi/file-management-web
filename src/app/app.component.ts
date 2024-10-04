import {Component} from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {RouterOutlet} from '@angular/router';
import {NgxSpinnerModule} from "ngx-spinner";

@Component({
  selector: 'vex-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, MatSnackBarModule]
})
export class AppComponent {
}
