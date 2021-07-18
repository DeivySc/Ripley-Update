import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaClienteHistoricoComponent } from './consulta-cliente-historico.component';

describe('ConsultaClienteCanjeComponent', () => {
  let component: ConsultaClienteHistoricoComponent;
  let fixture: ComponentFixture<ConsultaClienteHistoricoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaClienteHistoricoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaClienteHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
