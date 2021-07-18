import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoReglaVencimientoBandejaComponent } from './mantenimiento-regla-vencimiento-bandeja.component';

describe('MantenimientoReglaVencimientoBandejaComponent', () => {
  let component: MantenimientoReglaVencimientoBandejaComponent;
  let fixture: ComponentFixture<MantenimientoReglaVencimientoBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoReglaVencimientoBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoReglaVencimientoBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
