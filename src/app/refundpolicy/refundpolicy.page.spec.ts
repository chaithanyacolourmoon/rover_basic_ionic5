import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RefundpolicyPage } from './refundpolicy.page';

describe('RefundpolicyPage', () => {
  let component: RefundpolicyPage;
  let fixture: ComponentFixture<RefundpolicyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundpolicyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RefundpolicyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
