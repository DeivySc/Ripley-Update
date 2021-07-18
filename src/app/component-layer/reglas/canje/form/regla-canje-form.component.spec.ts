import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglaAcumulacionFormComponent } from './regla-acumulacion-form.component';

describe('NuevaReglaComponent', () => {
  let component: ReglaAcumulacionFormComponent;
  let fixture: ComponentFixture<ReglaAcumulacionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglaAcumulacionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglaAcumulacionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
