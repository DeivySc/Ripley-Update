import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoTipoVencimientoFormComponent } from './mantenimiento-tipo-vencimiento-form.component';

describe('MantenimientoTipoVencimientoFormComponent', () => {
  let component: MantenimientoTipoVencimientoFormComponent;
  let fixture: ComponentFixture<MantenimientoTipoVencimientoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoTipoVencimientoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoTipoVencimientoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
