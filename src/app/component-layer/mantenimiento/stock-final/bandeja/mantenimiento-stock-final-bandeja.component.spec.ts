import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoStockFinalBandejaComponent } from './mantenimiento-stock-final-bandeja.component';

describe('MantenimientoStockFinalBandejaComponent', () => {
  let component: MantenimientoStockFinalBandejaComponent;
  let fixture: ComponentFixture<MantenimientoStockFinalBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenimientoStockFinalBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoStockFinalBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
