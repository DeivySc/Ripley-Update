import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCuadreDiarioBandejaComponent } from './reporte-cuadre-diario-bandeja.component';

describe('ReporteCuadreDiarioBandejaComponent', () => {
  let component: ReporteCuadreDiarioBandejaComponent;
  let fixture: ComponentFixture<ReporteCuadreDiarioBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteCuadreDiarioBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteCuadreDiarioBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
