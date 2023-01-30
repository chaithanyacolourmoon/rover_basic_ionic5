import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BestsellerPage } from './bestseller.page';

describe('BestsellerPage', () => {
  let component: BestsellerPage;
  let fixture: ComponentFixture<BestsellerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestsellerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BestsellerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
