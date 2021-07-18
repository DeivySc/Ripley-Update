import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoValoradoBandejaComponent } from './mantenimiento-valorado-bandeja.component';

describe('MantenimientoValoradoBandejaComponent', () => {
  let component: MantenimientoValoradoBandejaComponent;
  let fixture: ComponentFixture<MantenimientoValoradoBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoValoradoBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoValoradoBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
