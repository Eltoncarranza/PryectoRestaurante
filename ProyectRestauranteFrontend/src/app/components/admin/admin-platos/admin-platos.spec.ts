import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPlatosComponent } from './admin-platos.component';

describe('AdminPlatos', () => {
  let component: AdminPlatosComponent;
  let fixture: ComponentFixture<AdminPlatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPlatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPlatosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
