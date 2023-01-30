import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CmcontactPage } from './cmcontact.page';

describe('CmcontactPage', () => {
  let component: CmcontactPage;
  let fixture: ComponentFixture<CmcontactPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmcontactPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CmcontactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
