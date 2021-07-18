import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteStockMensualBandejaComponent } from './reporte-stock-mensual-bandeja.component';

describe('ReporteStockMensualBandejaComponent', () => {
  let component: ReporteStockMensualBandejaComponent;
  let fixture: ComponentFixture<ReporteStockMensualBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteStockMensualBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteStockMensualBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
