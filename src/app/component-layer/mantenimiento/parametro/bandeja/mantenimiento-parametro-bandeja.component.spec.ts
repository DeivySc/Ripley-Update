import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoParametroBandejaComponent } from './mantenimiento-parametro-bandeja.component';

describe('MantenimientoParametroBandejaComponent', () => {
  let component: MantenimientoParametroBandejaComponent;
  let fixture: ComponentFixture<MantenimientoParametroBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoParametroBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoParametroBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
