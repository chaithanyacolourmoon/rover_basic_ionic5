import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddreviewPage } from './addreview.page';

describe('AddreviewPage', () => {
  let component: AddreviewPage;
  let fixture: ComponentFixture<AddreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddreviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
