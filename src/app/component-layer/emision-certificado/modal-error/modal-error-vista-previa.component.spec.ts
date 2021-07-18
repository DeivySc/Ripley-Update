import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalErrorVistaPreviaComponent } from './modal-error-vista-previa.component';

describe('VistaPreviaComponent', () => {
  let component: ModalErrorVistaPreviaComponent;
  let fixture: ComponentFixture<ModalErrorVistaPreviaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalErrorVistaPreviaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalErrorVistaPreviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
