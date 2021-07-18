import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAcumuladoAjusteBandejaComponent } from './reporte-acumulado-ajuste-bandeja.component';

describe('ReporteAcumuladoAjusteBandejaComponent', () => {
  let component: ReporteAcumuladoAjusteBandejaComponent;
  let fixture: ComponentFixture<ReporteAcumuladoAjusteBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteAcumuladoAjusteBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteAcumuladoAjusteBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
