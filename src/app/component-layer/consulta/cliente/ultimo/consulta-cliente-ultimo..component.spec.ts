import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaClienteUltimoComponent } from './consulta-cliente-ultimo.component';

describe('ConsultaClienteCanjeComponent', () => {
  let component: ConsultaClienteUltimoComponent;
  let fixture: ComponentFixture<ConsultaClienteUltimoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaClienteUltimoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaClienteUltimoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
