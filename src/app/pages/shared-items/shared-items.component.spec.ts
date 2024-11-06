import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedItemsComponent } from './shared-items.component';

describe('SharedItemsComponent', () => {
  let component: SharedItemsComponent;
  let fixture: ComponentFixture<SharedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SharedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
