import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsobLibComponent } from './csob-lib.component';

describe('CsobLibComponent', () => {
  let component: CsobLibComponent;
  let fixture: ComponentFixture<CsobLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CsobLibComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsobLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
