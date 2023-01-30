import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentfailurePage } from './paymentfailure.page';

describe('PaymentfailurePage', () => {
  let component: PaymentfailurePage;
  let fixture: ComponentFixture<PaymentfailurePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentfailurePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentfailurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
