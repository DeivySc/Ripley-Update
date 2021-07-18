import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoEmailProcesoBandejaComponent } from './mantenimiento-email-proceso-bandeja.component';

describe('MantenimientoEmailProcesoBandejaComponent', () => {
  let component: MantenimientoEmailProcesoBandejaComponent;
  let fixture: ComponentFixture<MantenimientoEmailProcesoBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoEmailProcesoBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoEmailProcesoBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
