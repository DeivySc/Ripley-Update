import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoReporteBandejaComponent } from './mantenimiento-reporte-bandeja.component';

describe('MantenimientoReporteBandejaComponent', () => {
  let component: MantenimientoReporteBandejaComponent;
  let fixture: ComponentFixture<MantenimientoReporteBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoReporteBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoReporteBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
