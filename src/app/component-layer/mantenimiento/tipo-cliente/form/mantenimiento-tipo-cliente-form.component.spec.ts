import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoTipoClienteFormComponent } from './mantenimiento-tipo-cliente-form.component';

describe('MantenimientoTipoClienteFormComponent', () => {
  let component: MantenimientoTipoClienteFormComponent;
  let fixture: ComponentFixture<MantenimientoTipoClienteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoTipoClienteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoTipoClienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
