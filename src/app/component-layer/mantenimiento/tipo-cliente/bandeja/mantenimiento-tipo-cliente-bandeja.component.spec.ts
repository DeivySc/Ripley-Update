import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoTipoClienteBandejaComponent } from './mantenimiento-tipo-cliente-bandeja.component';

describe('MantenimientoTipoClienteBandejaComponent', () => {
  let component: MantenimientoTipoClientesComponent;
  let fixture: ComponentFixture<MantenimientoTipoClienteBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoTipoClienteBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoTipoClienteBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
