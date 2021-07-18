import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoParametroFormComponent } from './mantenimiento-parametro-form.component';

describe('MantenimientoParametroFormComponent', () => {
  let component: MantenimientoParametroFormComponent;
  let fixture: ComponentFixture<MantenimientoParametroFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoParametroFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoParametroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
