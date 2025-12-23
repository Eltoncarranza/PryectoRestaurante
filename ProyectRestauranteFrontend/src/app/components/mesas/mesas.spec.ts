import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesasComponent } from './mesas.component'; // Ruta correcta al archivo .ts

describe('Mesas', () => {
  let component: MesasComponent;
  let fixture: ComponentFixture<MesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
