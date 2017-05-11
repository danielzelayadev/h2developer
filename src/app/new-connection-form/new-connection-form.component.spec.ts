import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewConnectionFormComponent } from './new-connection-form.component';

describe('NewConnectionFormComponent', () => {
  let component: NewConnectionFormComponent;
  let fixture: ComponentFixture<NewConnectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewConnectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewConnectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
