import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedWithUserComponent } from './shared-with-user.component';

describe('SharedWithUserComponent', () => {
  let component: SharedWithUserComponent;
  let fixture: ComponentFixture<SharedWithUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedWithUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedWithUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
