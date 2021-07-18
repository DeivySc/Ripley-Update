import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglaAcumulacionPlazoComponent } from './regla-acumulacion-plazo.component';

describe('ReglaAcumulacionPlazoComponent', () => {
  let component: ReglaAcumulacionPlazoComponent;
  let fixture: ComponentFixture<ReglaAcumulacionPlazoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglaAcumulacionPlazoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglaAcumulacionPlazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
