import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyOtpComponentComponent } from './verify-otp-component.component';

describe('VerifyOtpComponentComponent', () => {
  let component: VerifyOtpComponentComponent;
  let fixture: ComponentFixture<VerifyOtpComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyOtpComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyOtpComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
