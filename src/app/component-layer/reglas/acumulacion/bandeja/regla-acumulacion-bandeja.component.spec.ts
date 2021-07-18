import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglaAcumulacionBandejaComponent } from './regla-acumulacion-bandeja.component';

describe('ReglasAcumulacionListaComponent', () => {
  let component: ReglaAcumulacionBandejaComponent;
  let fixture: ComponentFixture<ReglaAcumulacionBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglaAcumulacionBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglaAcumulacionBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
