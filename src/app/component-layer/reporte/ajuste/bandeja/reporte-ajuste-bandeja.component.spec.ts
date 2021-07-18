import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAjusteBandejaComponent } from './reporte-ajuste-bandeja.component';

describe('ReporteAjusteBandejaComponent', () => {
  let component: ReporteAjusteBandejaComponent;
  let fixture: ComponentFixture<ReporteAjusteBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteAjusteBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteAjusteBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
