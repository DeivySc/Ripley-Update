import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglaValoradoFormComponent } from './regla-valorado-form.component';

describe('ReglaValoradoFormComponent', () => {
  let component: ReglaValoradoFormComponent;
  let fixture: ComponentFixture<ReglaValoradoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglaValoradoFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglaValoradoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
