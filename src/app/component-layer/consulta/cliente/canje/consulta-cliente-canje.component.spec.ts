import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaClienteCanjeComponent } from './consulta-cliente-canje.component';

describe('ConsultaClienteCanjeComponent', () => {
  let component: ConsultaClienteCanjeComponent;
  let fixture: ComponentFixture<ConsultaClienteCanjeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaClienteCanjeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaClienteCanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
