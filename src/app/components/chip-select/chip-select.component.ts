import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LiveAnnouncer } from '@angular/cdk/a11y';

import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'vex-chip-select',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  templateUrl: './chip-select.component.html',
  styleUrl: './chip-select.component.scss'
})
export class ChipSelectComponent {
  @Input() options: string[];
  @Input() label: string = 'Select one option';
  @Input() placeholder: string = 'Options...';
  @Input() controlName: string;
  @Input() formGroup: FormGroup;
  @Input() selectedOptions: string[] = [];
  @Output() selectedChange = new EventEmitter<string[]>();
  @Output() optionsChange = new EventEmitter();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  optionCtrl = new FormControl('', Validators.pattern(/^\.[a-zA-Z0-9]+$/));
  filteredOptions: Observable<string[]>;
  isInvalid = false;

  @ViewChild('optionInput') optionInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(private toast: ToastService) {
    this.filteredOptions = this.optionCtrl.valueChanges.pipe(
      startWith(null),
      map((option: string | null) => {
        this.isInvalid = this.formGroup.controls[this.controlName].invalid;
        return option ? this._filter(option) : this.options.slice();
      }),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Add our Option
    if (this.optionCtrl.invalid) {
      this.toast.open('فرمت وارد شده صحیح نمیباشد(باید به فرمت *. باشد)');
    }

    if (value && this.optionCtrl.valid) {
      this.selectedOptions.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.optionCtrl.setValue(null);
  }

  remove(option: string): void {
    const index = this.selectedOptions.indexOf(option);

    if (index >= 0) {
      this.selectedOptions.splice(index, 1);
      this.announcer.announce(`Removed ${option}`);
      this.emitChange();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    this.selectedOptions.push(value);
    this.optionInput.nativeElement.value = '';
    this.optionCtrl.setValue(null);
    this.emitChange();
    // this._filter(value);
  }

  emitChange() {
    this.formGroup.controls[this.controlName].setValue(this.selectedOptions);
    this.selectedChange.emit();
  }

  private _filter(value: string) {
    const filteredOptions = this.options.filter((option) => option !== value);
    this.optionsChange.emit(filteredOptions);
    return filteredOptions;
  }
}
