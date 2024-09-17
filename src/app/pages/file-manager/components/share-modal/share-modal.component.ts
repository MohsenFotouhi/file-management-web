import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {SearchService} from "../../../../services/search.service";
import {Subscription} from "rxjs";
import {SearchUser} from "../../../../interface/search-interface";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

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
    MatButtonModule
  ],
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.scss'
})
export class ShareModalComponent {
  isPublic = new FormControl(false);
  searchValue = new FormControl('');
  expireDate = new FormControl('');
  emailValue = new FormControl('', Validators.pattern(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/));

  searchSub!: Subscription;
  selectedUserList: SearchUser[] = [];
  userList: SearchUser[] = [];
  emailList: any[] = [];
  searchLoading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private matDialog: MatDialog,
              private searchService: SearchService) {
  }

  onSearch(): void {
    if (this.searchValue.value) {
      if (this.searchSub) this.searchSub.unsubscribe();
      this.searchLoading = true;
      this.searchSub = this.searchService.search(this.searchValue.value || '').subscribe(res => {
        this.searchLoading = false;
        this.userList = res;
      }, () => {
        this.searchLoading = false;
        this.userList = [];
      })
    }
  }

  onSelectUser(user: SearchUser): void {
    const index = this.selectedUserList?.findIndex(i => i.userGUID === user.userGUID);
    if (index > -1) {
      this.selectedUserList.splice(index, 1);
    } else {
      this.selectedUserList.push(user)
    }
  }

  isUserSelected(user: SearchUser): boolean {
    return this.selectedUserList.findIndex(i => i.userGUID === user.userGUID) > -1;
  }

  addEmail(): void {
    if (this.emailValue.valid && this.emailValue.value) {
      const email: any = this.emailValue.value
      this.emailList.push(email);
      this.emailValue.setValue('');
    }
  }

  removeEmail(i: number): void {
    this.emailList.splice(i, 1);
  }

  closeModal(): void {
    this.matDialog.closeAll();
  }

  createLink(): void {
    const selectedUser = this.selectedUserList;
    console.log(selectedUser);
    console.log(this.emailList);

    var url2 = "https://localhost:7205/api/DownloadManager/CreateDownloadLink";

  }

}
