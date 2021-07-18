import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeClaveComponent } from './change-clave.component';

describe('ChangeClaveComponent', () => {
  let component: ChangeClaveComponent;
  let fixture: ComponentFixture<ChangeClaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeClaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
