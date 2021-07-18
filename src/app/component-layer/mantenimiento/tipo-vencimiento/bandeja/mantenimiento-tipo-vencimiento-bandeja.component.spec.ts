import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoTipoVencimientoBandejaComponent } from './mantenimiento-tipo-vencimiento-bandeja.component';

describe('MantenimientoTipoVencimientoBandejaComponent', () => {
  let component: MantenimientoTipoVencimientoBandejaComponent;
  let fixture: ComponentFixture<MantenimientoTipoVencimientoBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoTipoVencimientoBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoTipoVencimientoBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
