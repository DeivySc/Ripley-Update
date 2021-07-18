import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoSucursalComercioComponent } from './mantenimiento-sucursal-comercio.component';

describe('MantenimientoSucursalComercioComponent', () => {
  let component: MantenimientoSucursalComercioComponent;
  let fixture: ComponentFixture<MantenimientoSucursalComercioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoSucursalComercioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoSucursalComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
