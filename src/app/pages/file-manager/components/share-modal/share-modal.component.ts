import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import * as moment from 'jalali-moment';
import { finalize, Subscription, tap } from 'rxjs';
import { CreateDownloadLinkCommand } from 'src/app/interface/share-models';
import { User } from 'src/app/interface/shared-file';
import { ShareService } from 'src/app/services/share.service';
import { SearchUser } from '../../../../interface/search-interface';
import { SearchService } from '../../../../services/search.service';
import { PersianCalendarComponent } from '../persian-calendar/persian-calendar.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'vex-share-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    PersianCalendarComponent,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.scss'
})
export class ShareModalComponent {
  selectedDate!: Date;
  isPublic = new FormControl(false);
  isPermanent = new FormControl(false);
  searchValue = new FormControl('');
  expireDate = new FormControl('');
  emailValue = new FormControl(
    '',
    Validators.pattern(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)
  );

  searchSub!: Subscription;
  selectedUserList: SearchUser[] = [];
  userList: SearchUser[] = [];
  emailList: any[] = [];
  searchLoading = false;
  fileName: string = '';
  virtualPath: string = '';
  sharedLink: string = '';
  fileID: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private searchService: SearchService,
    private spinner: NgxSpinnerService,
    private shareService: ShareService
  ) {
    this.virtualPath = data.VirtualPath;
    this.fileID = data.FileId;
  }

  clickEvent(link: string) {
    navigator.clipboard.writeText(link);
  }

  openCalendar(): void {
    const dialogRef = this.dialog.open(PersianCalendarComponent, {
      width: '300px',
      height: '320px',
      data: { selectedDate: this.selectedDate }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.selectedDate = result;
        this.expireDate.setValue(result);
      }
    });
  }

  onSearch(): void {
    if (this.searchValue.value) {
      if (this.searchSub) this.searchSub.unsubscribe();
      this.searchLoading = true;
      this.searchSub = this.searchService
        .search(this.searchValue.value || '')
        .subscribe(
          (res) => {
            this.searchLoading = false;
            this.userList = res;
          },
          () => {
            this.searchLoading = false;
            this.userList = [];
          }
        );
    }
  }

  onSelectUser(user: SearchUser): void {
    const index = this.selectedUserList?.findIndex(
      (i) => i.userGUID === user.userGUID
    );
    if (index > -1) {
      this.selectedUserList.splice(index, 1);
    } else {
      this.selectedUserList.push(user);
    }
  }

  isUserSelected(user: SearchUser): boolean {
    return (
      this.selectedUserList.findIndex((i) => i.userGUID === user.userGUID) > -1
    );
  }

  addEmail(): void {
    if (this.emailValue.valid && this.emailValue.value) {
      const email: any = this.emailValue.value;
      this.emailList.push(email);
      this.emailValue.setValue('');
    }
  }

  removeEmail(i: number): void {
    this.emailList.splice(i, 1);
  }

  closeModal(): void {
    this.dialog.closeAll();
  }

  createLink(): void {
    const selectedUser: User[] = [];
    const selectedEmails: string[] = [];
    this.selectedUserList.forEach((x) =>
      selectedUser.push({ userId: x.userGUID, username: x.username })
    );
    this.emailList.forEach((x) => selectedEmails.push(x.value));

    const jalaliDate = this.selectedDate; // تاریخ شمسی به فرمت YYYY/MM/DD
    const gregorianDate = moment(jalaliDate, 'jYYYY/jMM/jDD').toDate();

    // فرمت خروجی به صورت YYYY-MM-DD

    console.log('emailList', this.emailList);
    const shareObject: CreateDownloadLinkCommand = {
      isPermanent:
        this.isPermanent.value !== null ? this.isPermanent.value : false,
      isPublic: this.isPublic.value !== null ? this.isPublic.value : false,
      expireDateTime: gregorianDate,
      virtualPath: this.virtualPath,
      shareWithUsers: selectedUser,
      shareWithEmails: this.emailList,
      FileID: this.fileID
    };

    this.spinner.show();
    this.shareService
      .createDownloadLink(shareObject)
      .pipe(
        tap((res) => {
          this.sharedLink = res.link;
        }),
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (res: any) => {},
        error: (error) => {
          console.error('There was an error:', error);
          if (error.error.errors) {
            console.log('Validation Errors:', error.error.errors);
          }
        }
      });
  }

}
