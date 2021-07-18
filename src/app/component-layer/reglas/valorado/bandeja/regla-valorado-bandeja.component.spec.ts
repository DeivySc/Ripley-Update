import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglaValoradoBandejaComponent } from './regla-valorado-bandeja.component';

describe('ReglaCanjeBandejaComponent', () => {
  let component: ReglaValoradoBandejaComponent;
  let fixture: ComponentFixture<ReglaValoradoBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglaValoradoBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglaValoradoBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
