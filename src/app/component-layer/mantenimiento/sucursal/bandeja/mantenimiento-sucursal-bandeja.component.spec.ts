import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoSucursalBandejaComponent } from './mantenimiento-sucursal-bandeja.component';

describe('MantenimientoSucursalBandejaComponent', () => {
  let component: MantenimientoSucursalBandejaComponent;
  let fixture: ComponentFixture<MantenimientoSucursalBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoSucursalBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoSucursalBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
