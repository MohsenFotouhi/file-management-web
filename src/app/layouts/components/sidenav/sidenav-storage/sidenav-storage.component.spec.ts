import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavStorageComponent } from './sidenav-storage.component';

describe('SidenavStorageComponent', () => {
  let component: SidenavStorageComponent;
  let fixture: ComponentFixture<SidenavStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavStorageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidenavStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
