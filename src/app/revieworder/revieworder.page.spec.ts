import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RevieworderPage } from './revieworder.page';

describe('RevieworderPage', () => {
  let component: RevieworderPage;
  let fixture: ComponentFixture<RevieworderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevieworderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RevieworderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
