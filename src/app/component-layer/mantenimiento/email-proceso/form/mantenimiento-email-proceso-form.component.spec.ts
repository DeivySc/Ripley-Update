import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoEmailProcesoFormComponent } from './mantenimiento-email-proceso-form.component';

describe('MantenimientoEmailProcesoFormComponent', () => {
  let component: MantenimientoEmailProcesoFormComponent;
  let fixture: ComponentFixture<MantenimientoEmailProcesoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoEmailProcesoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoEmailProcesoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
