import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpecialtagPage } from './specialtag.page';

describe('SpecialtagPage', () => {
  let component: SpecialtagPage;
  let fixture: ComponentFixture<SpecialtagPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialtagPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpecialtagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
