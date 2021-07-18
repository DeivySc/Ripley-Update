import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaClienteResumeComponent } from './consulta-cliente-resume.component';

describe('ConsultaClienteResumeComponent', () => {
  let component: ConsultaClienteResumeComponent;
  let fixture: ComponentFixture<ConsultaClienteResumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaClienteResumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaClienteResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
