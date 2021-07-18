import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaCampaniaBandejaComponent } from './carga-campania-bandeja.component';

describe('CargaCampaniaBandejaComponent', () => {
  let component: CargaCampaniaBandejaComponent;
  let fixture: ComponentFixture<CargaCampaniaBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaCampaniaBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaCampaniaBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
