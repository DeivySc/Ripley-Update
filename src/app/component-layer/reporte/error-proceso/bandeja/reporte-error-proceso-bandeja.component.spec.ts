import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteErrorProcesoBandejaComponent } from './reporte-error-proceso-bandeja.component';

describe('ReporteErrorProcesoBandejaComponent', () => {
  let component: ReporteErrorProcesoBandejaComponent;
  let fixture: ComponentFixture<ReporteErrorProcesoBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteErrorProcesoBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteErrorProcesoBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
