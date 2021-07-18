import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoValoradoFormComponent } from './mantenimiento-valorado-form.component';

describe('MantenimientoValoradoFormComponent', () => {
  let component: MantenimientoValoradoFormComponent;
  let fixture: ComponentFixture<MantenimientoValoradoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoValoradoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoValoradoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
