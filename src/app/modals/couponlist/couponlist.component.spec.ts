import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CouponlistComponent } from './couponlist.component';

describe('CouponlistComponent', () => {
  let component: CouponlistComponent;
  let fixture: ComponentFixture<CouponlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponlistComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CouponlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
