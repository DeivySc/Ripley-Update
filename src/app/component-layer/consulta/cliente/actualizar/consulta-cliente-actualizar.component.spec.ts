import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaClienteActualizarComponent } from './consulta-cliente-actualizar.component';

describe('ConsultaClienteActualizarComponent', () => {
  let component: ConsultaClienteActualizarComponent;
  let fixture: ComponentFixture<ConsultaClienteActualizarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaClienteActualizarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaClienteActualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
