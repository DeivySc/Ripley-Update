import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmisionCertificadoBandejaComponent } from './emision-certificado-bandeja.component';

describe('EmisionCertificadoBandejaComponent', () => {
  let component: EmisionCertificadoBandejaComponent;
  let fixture: ComponentFixture<EmisionCertificadoBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmisionCertificadoBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmisionCertificadoBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
