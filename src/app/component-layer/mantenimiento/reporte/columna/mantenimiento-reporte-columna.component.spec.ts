import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoReporteColumnaComponent } from './mantenimiento-reporte-columna.component';

describe('MantenimientoReporteColumnaComponent', () => {
  let component: MantenimientoReporteColumnaComponent;
  let fixture: ComponentFixture<MantenimientoReporteColumnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoReporteColumnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoReporteColumnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
