import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersianCalendarComponent } from './persian-calendar.component';

describe('PersianCalendarComponent', () => {
  let component: PersianCalendarComponent;
  let fixture: ComponentFixture<PersianCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersianCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PersianCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
