import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaClienteBandejaComponent } from './consulta-cliente-bandeja.component';

describe('ConsultaClienteBandejaComponent', () => {
  let component: ConsultaClienteBandejaComponent;
  let fixture: ComponentFixture<ConsultaClienteBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaClienteBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaClienteBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
