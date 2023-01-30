import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddcashPage } from './addcash.page';

describe('AddcashPage', () => {
  let component: AddcashPage;
  let fixture: ComponentFixture<AddcashPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcashPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddcashPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
