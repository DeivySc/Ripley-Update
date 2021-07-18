import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoValoradoSucursalComponent } from './mantenimiento-valorado-sucursal.component.ts';

describe('MantenimientoValoradoSucursalComponent', () => {
  let component: MantenimientoValoradoSucursalComponent;
  let fixture: ComponentFixture<MantenimientoValoradoSucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoValoradoSucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoValoradoSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
