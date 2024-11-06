import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFileDialogComponent } from './user-file-dialog.component';

describe('UserFileDialogComponent', () => {
  let component: UserFileDialogComponent;
  let fixture: ComponentFixture<UserFileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFileDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserFileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
