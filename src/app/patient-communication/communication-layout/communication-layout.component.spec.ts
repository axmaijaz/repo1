import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationLayoutComponent } from './communication-layout.component';

describe('CommunicationLayoutComponent', () => {
  let component: CommunicationLayoutComponent;
  let fixture: ComponentFixture<CommunicationLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicationLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
