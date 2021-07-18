import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCanjeEstablecimientoBandejaComponent } from './reporte-canje-establecimiento-bandeja.component';

describe('ReporteCanjeEstablecimientoBandejaComponent', () => {
  let component: ReporteCanjeEstablecimientoBandejaComponent;
  let fixture: ComponentFixture<ReporteCanjeEstablecimientoBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteCanjeEstablecimientoBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteCanjeEstablecimientoBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
