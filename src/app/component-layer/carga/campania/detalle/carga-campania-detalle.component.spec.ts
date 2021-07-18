import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoReporteDetalleComponent } from './carga-campania-detalle.component';

describe('MantenimientoReporteDetalleComponent', () => {
  let component: MantenimientoReporteDetalleComponent;
  let fixture: ComponentFixture<MantenimientoReporteDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoReporteDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoReporteDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
