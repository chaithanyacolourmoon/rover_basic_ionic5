import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileaddaddressPage } from './profileaddaddress.page';

describe('ProfileaddaddressPage', () => {
  let component: ProfileaddaddressPage;
  let fixture: ComponentFixture<ProfileaddaddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileaddaddressPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileaddaddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
