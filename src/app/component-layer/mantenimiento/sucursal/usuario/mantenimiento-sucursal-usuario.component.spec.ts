import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoSucursalUsuarioComponent } from './mantenimiento-sucursal-usuario.component';

describe('ListaUsuariosComponent', () => {
  let component: MantenimientoSucursalUsuarioComponent;
  let fixture: ComponentFixture<MantenimientoSucursalUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoSucursalUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoSucursalUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
