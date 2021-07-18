import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMovimientoMesBandejaComponent } from './reporte-movimiento-mes-bandeja.component';

describe('ReporteMovimientoMesBandejaComponent', () => {
  let component: ReporteMovimientoMesBandejaComponent;
  let fixture: ComponentFixture<ReporteMovimientoMesBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteMovimientoMesBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteMovimientoMesBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
