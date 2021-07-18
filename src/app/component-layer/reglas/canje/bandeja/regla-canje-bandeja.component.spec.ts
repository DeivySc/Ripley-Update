import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglaCanjeBandejaComponent } from './regla-canje-bandeja.component';

describe('ReglaCanjeBandejaComponent', () => {
  let component: ReglaCanjeBandejaComponent;
  let fixture: ComponentFixture<ReglaCanjeBandejaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglaCanjeBandejaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglaCanjeBandejaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
