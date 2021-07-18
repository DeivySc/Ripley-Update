import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoSucursalFormComponent } from './mantenimiento-sucursal-form.component';

describe('RegistrarSucursalComponent', () => {
  let component: MantenimientoSucursalFormComponent;
  let fixture: ComponentFixture<MantenimientoSucursalFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoSucursalFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoSucursalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
