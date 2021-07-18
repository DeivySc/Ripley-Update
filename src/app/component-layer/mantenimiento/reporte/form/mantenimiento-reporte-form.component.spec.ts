import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoReporteFormComponent } from './mantenimiento-reporte-form.component';

describe('MantenimientoReporteFormComponent', () => {
  let component: MantenimientoReporteFormComponent;
  let fixture: ComponentFixture<MantenimientoReporteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoReporteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoReporteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
