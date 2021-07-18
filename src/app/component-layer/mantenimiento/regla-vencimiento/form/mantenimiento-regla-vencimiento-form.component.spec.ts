import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoReglaVencimientoFormComponent } from './mantenimiento-regla-vencimiento-form.component';

describe('MantenimientoReglaVencimientoFormComponent', () => {
  let component: MantenimientoReglaVencimientoFormComponent;
  let fixture: ComponentFixture<MantenimientoReglaVencimientoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoReglaVencimientoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoReglaVencimientoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
