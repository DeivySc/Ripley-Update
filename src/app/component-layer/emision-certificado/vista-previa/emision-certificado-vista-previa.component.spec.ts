import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmisionCertificadoVistaPreviaComponent } from './emision-certificado-vista-previa.component';

describe('VistaPreviaComponent', () => {
  let component: EmisionCertificadoVistaPreviaComponent;
  let fixture: ComponentFixture<EmisionCertificadoVistaPreviaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmisionCertificadoVistaPreviaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmisionCertificadoVistaPreviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
