import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDiarioAjusteBandejaComponent } from './reporte-diario-ajuste-bandeja.component';

describe('ReporteDiarioAjusteBandejaComponent', () => {
  let component: ReporteDiarioAjusteBandejaComponent;
  let fixture: ComponentFixture<ReporteDiarioAjusteBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteDiarioAjusteBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteDiarioAjusteBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
